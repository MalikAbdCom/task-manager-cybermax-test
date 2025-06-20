import React from "react";
import { TaskCard } from "./TaskCard";
import { useTasks } from "../lib/hooks/useTasks";
import { useTaskStore } from "../lib/store";
import { motion, AnimatePresence } from "framer-motion";

export function TaskList() {
  const { isLoading, error } = useTasks();
  const tasks = useTaskStore((state) => state.tasks);
  const creatingTaskIds = useTaskStore((state) => state.creatingTaskIds);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading tasks: {error.toString()}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No tasks yet. Create a new task to get started.
        </p>
      </div>
    );
  }

  // Sort tasks with incomplete tasks first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    // First, sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then sort by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
            layoutId={`task-${task.id}`}
          >
            <TaskCard
              task={task}
              isCreating={creatingTaskIds.includes(task.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
