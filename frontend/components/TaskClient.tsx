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
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <div className="flex gap-2">
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
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Organize your tasks efficiently
          </p>
        </header>

        <main className="bg-white shadow-sm rounded-lg p-6 dark:bg-gray-800">
          <TaskList />
        </main>
      </div>
    </div>
  );
}
