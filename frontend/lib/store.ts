import { create } from 'zustand';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskState {
  tasks: Task[];
  creatingTaskIds: number[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  setTasks: (tasks: Task[]) => void;
  addCreatingTaskId: (taskId: number) => void;
  removeCreatingTaskId: (taskId: number) => void;
};



export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  creatingTaskIds: [],
  addTask: (task: Task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  updateTask: (task: Task) => set((state) => ({
    tasks: state.tasks.map(t => t.id === task.id ? task : t)
  })),
  deleteTask: (taskId: number) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== taskId),
    // Also remove from creating tasks if it was there
    creatingTaskIds: state.creatingTaskIds.filter(id => id !== taskId)
  })),
  setTasks: (tasks: Task[]) => set({ tasks }),
  addCreatingTaskId: (taskId: number) => set((state) => ({
    creatingTaskIds: [...state.creatingTaskIds, taskId]
  })),
  removeCreatingTaskId: (taskId: number) => set((state) => ({
    creatingTaskIds: state.creatingTaskIds.filter(id => id !== taskId)
  }))
}));
