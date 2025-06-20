"use client";

import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useTaskStore } from "../lib/store";
import { useState } from "react";
import { generatePDF } from "../lib/pdfGenerator";
import { ModeToggle } from "./DarkToggle";

export function TaskClient() {
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await generatePDF(tasks);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <header className="mb-8 flex flex-col items-center sm:flex-row sm:justify-between sm:items-start">
          <div className="sm:w-1/2">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">Task Manager</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Organize your tasks efficiently
            </p>
          </div>
          <div className="flex gap-2 sm:w-1/2 sm:justify-end">
            <Button
              onClick={handleGeneratePDF}
              disabled={tasks.length === 0 || generatingPDF}
              className="flex items-center gap-2 cursor-pointer"
            >
              {generatingPDF ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Report
                </>
              )}
            </Button>
            <TaskForm />
            <ModeToggle />
          </div>
        </header>

        <main className="bg-white shadow-sm rounded-2xl p-2 dark:bg-gray-800">
          <TaskList />
        </main>
      </div>
    </div>
  );
}
