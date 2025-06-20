import jsPDF from "jspdf";
import { Task } from "./store";

/**
 * Generate a PDF report of all tasks
 * @param tasks - Array of tasks to include in the report
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export const generatePDF = async (tasks: Task[]): Promise<void> => {
  // Create a new PDF document
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: "Task Manager Report",
    subject: "Tasks Report",
    author: "Task Manager",
    creator: "Task Manager App",
  });

  // Add title
  doc.setFontSize(22);
  doc.text("Task Manager Report", 20, 20);

  // Add generation date
  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Generated on: ${date}`, 20, 30);

  // Add task statistics
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  doc.setFontSize(14);
  doc.text("Summary:", 20, 45);
  doc.setFontSize(12);
  doc.text(`Total Tasks: ${tasks.length}`, 25, 55);
  doc.text(`Completed: ${completedTasks}`, 25, 62);
  doc.text(`Pending: ${pendingTasks}`, 25, 69);

  // Add tasks list header
  doc.setFontSize(16);
  doc.text("Tasks List:", 20, 85);

  // Set up task list columns
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Title", 25, 95);
  doc.text("Status", 150, 95);

  // Line under headers
  doc.setDrawColor(200);
  doc.line(20, 97, 190, 97);
  doc.setTextColor(0);

  // Add each task
  let yPos = 105;
  const itemsPerPage = 20;
  let itemCount = 0;

  tasks.forEach((task) => {
    // Add a new page if needed
    if (itemCount === itemsPerPage) {
      doc.addPage();
      yPos = 20;
      itemCount = 0;
    }

    // Format task title (truncate if too long)
    const title =
      task.title.length > 50 ? task.title.substring(0, 47) + "..." : task.title;

    // Add task to PDF
    doc.text(title, 25, yPos);
    doc.text(task.completed ? "Completed" : "Pending", 150, yPos);

    // Add description if exists, with smaller font
    if (task.description) {
      doc.setFontSize(9);
      doc.setTextColor(100);

      // Format description (truncate if too long)
      const description =
        task.description.length > 70
          ? task.description.substring(0, 67) + "..."
          : task.description;

      doc.text(description, 25, yPos + 5);
      doc.setFontSize(11);
      doc.setTextColor(0);
      yPos += 12; // More space for items with description
    } else {
      yPos += 8; // Standard spacing for items without description
    }

    itemCount++;
  });

  // Save the PDF
  doc.save("task-manager-report.pdf");

  return Promise.resolve();
};
