import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Task } from "../lib/store";
import { useUpdateTask } from "../lib/hooks/useTasks";
import { TaskEditDialog } from "./TaskEditDialog";

type TaskCardProps = {
  task: Task;
  isCreating?: boolean;
};

export function TaskCard({ task, isCreating = false }: TaskCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateTask = useUpdateTask();

  const handleToggleComplete = (e: React.MouseEvent) => {
    // Prevent dialog from opening when checkbox is clicked
    e.stopPropagation();

    updateTask.mutate(
      {
        id: task.id,
        completed: !task.completed,
      },
      {
        onSuccess: () => {
          toast.success(task.completed ? "Task marked as incomplete" : "Task completed");
        },
        onError: () => {
          toast.error("Failed to update task status");
        },
      }
    );
  };

  return (
    <>
      <Card
        className={`w-full ${
          task.completed ? "bg-gray-800 dark:bg-gray-700" : ""
        } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer relative`}
        onClick={() => setDialogOpen(true)}
      >
        {isCreating && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <div className="flex items-center">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => {}} // Empty handler as we're now handling click in the parent handler
              onClick={handleToggleComplete}
              id={`task-${task.id}`}
              className="cursor-pointer bg-gray-800 dark:bg-gray-400"
            />
          </div>
          <div className="flex-1">
            <CardTitle
              className={`text-sm font-medium ${
                task.completed
                  ? "line-through text-gray-300 dark:text-gray-400"
                  : ""
              }`}
            >
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription
                className={`mt-1 text-xs ${
                  task.completed ? "text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {task.description.length > 60
                  ? `${task.description.substring(0, 60)}...`
                  : task.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>
      </Card>

      <TaskEditDialog
        task={task}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
