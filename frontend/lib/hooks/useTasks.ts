import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useTaskStore, type Task } from "../store";
import api from "../api";

// API functions
const fetchTasks = async () => {
  const response = await api.get<Task[]>("/tasks/");
  return response.data;
};

const createTask = async (taskData: Pick<Task, "title" | "description">) => {
  const response = await api.post<Task>("/tasks/", taskData);
  return response.data;
};

const updateTask = async (task: {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
}) => {
  const { id, ...updateData } = task;
  const response = await api.put<Task>(`/tasks/${id}`, updateData);
  return response.data;
};

const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}`);
  return taskId;
};

// Custom hooks
export function useTasks() {
  // const queryClient = useQueryClient();
  const { setTasks } = useTaskStore();

  const result = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Handle data setting outside the query options using an effect
  React.useEffect(() => {
    if (result.data) {
      setTasks(result.data);
    }
  }, [result.data, setTasks]);

  // Log errors
  React.useEffect(() => {
    if (result.error) {
      console.error("Error fetching tasks:", result.error);
    }
  }, [result.error]);

  return result;
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { addTask, addCreatingTaskId, removeCreatingTaskId, deleteTask } =
    useTaskStore();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTaskData) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Get current tasks from the cache
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];

      // Create an optimistic task with a temporary ID and current timestamp
      const optimisticTask: Task = {
        id: Math.floor(Math.random() * -1000000), // Temporary negative ID to avoid conflicts
        title: newTaskData.title,
        description: newTaskData.description || null,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add optimistic task to the store
      addTask(optimisticTask);

      // Mark the task as creating (for loading spinner)
      addCreatingTaskId(optimisticTask.id);

      // Add optimistic task to the cache
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        return old ? [...old, optimisticTask] : [optimisticTask];
      });

      // Return the context with previous tasks and optimistic task
      return { previousTasks, optimisticTask };
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to restore the previous state
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      // Remove the optimistic task from the store and creating list
      if (context?.optimisticTask) {
        deleteTask(context.optimisticTask.id);
        removeCreatingTaskId(context.optimisticTask.id);
      }
    },
    onSuccess: (newTask, _variables, context) => {
      // Remove the temporary optimistic task
      if (context?.optimisticTask) {
        deleteTask(context.optimisticTask.id);
        removeCreatingTaskId(context.optimisticTask.id);
      }

      // Add the real task from the server
      addTask(newTask);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { updateTask: updateTaskInStore } = useTaskStore();

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (taskUpdate) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Get current tasks
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];

      // Create an optimistic updated task
      const currentTask = previousTasks.find(
        (task) => task.id === taskUpdate.id
      );
      if (!currentTask) return { previousTasks };

      const optimisticTask: Task = {
        ...currentTask,
        ...taskUpdate,
        updated_at: new Date().toISOString(),
      };

      // Update task in the store optimistically
      updateTaskInStore(optimisticTask);

      // Update the query cache optimistically
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return previousTasks;
        return old.map((task) =>
          task.id === taskUpdate.id ? optimisticTask : task
        );
      });

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, roll back to the previous state
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSuccess: (updatedTask) => {
      // Update with the actual response data
      updateTaskInStore(updatedTask);
    },
    onSettled: () => {
      // Always invalidate to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { deleteTask: deleteTaskFromStore } = useTaskStore();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous tasks
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];

      // Optimistically remove the task from store
      deleteTaskFromStore(taskId);

      // Optimistically remove the task from cache
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return [];
        return old.filter((task) => task.id !== taskId);
      });

      return { previousTasks, taskId };
    },
    onError: (_error, _variables, context) => {
      // If the deletion fails, restore the previous state
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch to make sure our cache is in sync with the server
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
