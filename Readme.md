# Task Manager Dashboard

## Project Overview

Task Manager is a comprehensive task management dashboard built with React.js and TypeScript, interfacing with a FastAPI backend. This application allows users to efficiently manage their tasks with features for creating, viewing, completing, and deleting tasks, as well as generating downloadable PDF reports.

## Features

- **Task Management**:

  - View all tasks with their title, description, and completion status
  - Create new tasks with validation
  - Mark tasks as complete or incomplete
  - Delete unwanted tasks
  - Visual indicators for completed tasks

- **PDF Report Generation**:
  - Generate comprehensive PDF reports of all tasks
  - Include task titles, descriptions, and completion status
  - Reports include timestamp and application name
  - One-click download functionality

## Tech Stack

### Frontend

- **Framework**: React.js with TypeScript (Next.js)
- **Styling**: Tailwind CSS/Shadcn UI
- **State Management**: Zustand / React Query
- **API Client**: Axios
- **PDF Generation**: jspdf
- **Testing**: React Testing Library / Cypress
- **Routing**: Next.js

## Installation

```bash
# Clone the repository
git clone https://github.com/MalikAbdCom/task-manager-cybermax-test

# Navigate to the project directory
cd task-manager-cybermax-test

# Install dependencies for both frontend and backend
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

## Usage

### Starting the Development Servers

#### Frontend

```bash
cd frontend
npm run dev
```

#### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Key User Interactions

1. **Viewing Tasks**:

   - All tasks are displayed on the main dashboard
   - Completed tasks are visually distinguished

2. **Adding a Task**:

   - Click the "Add Task" button
   - Fill in the required title and optional description
   - Submit the form

3. **Managing Tasks**:

   - Toggle task completion status with the checkbox/toggle button
   - Delete tasks using the delete button

4. **Generating Reports**:
   - Click "Download Report" button
   - A PDF containing all current tasks will be generated and downloaded

## Project Structure

```
task-manager-cybermax-test/
├── frontend/              # React.js + TypeScript frontend (Next.js)
│   ├── components/        # React components
│   ├── lib/              # Utility functions and hooks
│   ├── app/              # Application pages and routes
│   └── public/           # Static assets
│   └── cypress/          # Cypress e2e tests
├── backend/              # FastAPI backend
└── README.md             # Project documentation
```

## Development

### Adding New Features

1. Create a new branch for your feature
2. Implement the feature with appropriate tests
3. Submit a pull request for review

### Code Style and Standards

- Follow TypeScript best practices
- Maintain component-based architecture
- Write unit tests for new functionality

## Troubleshooting

### Common Issues

- **API Connection Errors**: Verify that the backend server is running and the frontend is configured with the correct API endpoint
- **Styling Issues**: Make sure Tailwind CSS dependencies are correctly installed
- **PDF Generation Errors**: Check browser console for specific error messages related to PDF generation
