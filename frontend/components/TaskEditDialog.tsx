"use client";

import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Task } from "../lib/store";
import { Trash2 } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "../lib/hooks/useTasks";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the task schema with Zod
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskEditDialogProps = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
}: TaskEditDialogProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  // Reset form when dialog is opened with new task data
  React.useEffect(() => {
    if (open) {
      reset({
        title: task.title,
        description: task.description || "",
      });
    }
  }, [open, reset, task]);

  const onSubmit = (data: TaskFormValues) => {
    updateTask.mutate(
      {
        id: task.id,
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Task updated successfully");
        },
        onError: () => {
          toast.error("Failed to update task");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("Task deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete task");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="title"
                placeholder="Task title"
                className={
                  errors.title
                    ? "border-red-400 focus-visible:ring-red-300"
                    : ""
                }
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <textarea
                id="description"
                placeholder="Task description"
                className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  errors.description
                    ? "border-red-400 focus-visible:ring-red-300"
                    : ""
                }`}
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Task dates */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(task.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {task.updated_at && task.updated_at !== task.created_at && (
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(task.updated_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateTask.isPending}
                className="cursor-pointer"
              >
                {updateTask.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
