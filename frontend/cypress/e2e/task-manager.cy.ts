describe("Task Manager Application", () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit("/");

    // Clear existing tasks to ensure tests are isolated
    cy.intercept("GET", "http://localhost:8000/tasks/", (req) => {
      req.reply({ body: [] });
    }).as("getTasks");
  });

  it("should load the home page successfully", () => {
    // Verify the page title and heading
    cy.title().should("include", "Task Manager");
    cy.get("h1").should("contain", "Task Manager");
  });

  it("should create a new task", () => {
    // Comment out API interception to test with real backend
    /*
    // Intercept task creation API call
    cy.intercept("POST", "http://localhost:8000/tasks/", (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: "test-task-id",
          title: "New Test Task",
          description: "This is a test task",
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }).as("createTask");
    */

    // Open the create task dialog
    cy.contains("button", "Add Task").click();

    // Fill out the form
    cy.get('input[placeholder="Enter task title"]').type("New Test Task");
    cy.get('textarea[placeholder="Enter task description"]').type(
      "This is a test task"
    );

    // Submit the form
    cy.contains("button", "Create Task").click();

    // Skip waiting for API call since we're not intercepting it
    // cy.wait("@createTask");

    // Verify the task appears in the UI
    cy.contains("New Test Task").should("be.visible");
  });

  it("should toggle task completion status", () => {
    // Create a mock task
    cy.intercept("GET", "http://localhost:8000/tasks/", {
      body: [
        {
          id: "test-task-id",
          title: "Toggle Test Task",
          description: "This task will be toggled",
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    }).as("getTasks");

    // Visit page to load mock task
    cy.visit("/");
    // cy.wait("@getTasks");

    // Intercept task update API call
    cy.intercept("PUT", "http://localhost:8000/tasks/*", (req) => {
      req.reply({
        body: {
          id: "test-task-id",
          title: "Toggle Test Task",
          description: "This task will be toggled",
          completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }).as("updateTask");

    // Click the checkbox to toggle completion
    cy.get('[data-slot="checkbox"]').click();

    // Wait for the API call and verify the task appears completed
    // cy.wait("@updateTask");
    cy.get(".bg-gray-800").should("be.visible");
  });

  it("should edit a task", () => {
    // Create a mock task
    cy.intercept("GET", "http://localhost:8000/tasks/", {
      body: [
        {
          id: "test-task-id",
          title: "Edit Test Task",
          description: "This task will be edited",
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    }).as("getTasks");

    // Visit page to load mock task
    cy.visit("/");
    cy.wait("@getTasks");

    // Intercept task update API call
    cy.intercept("PUT", "http://localhost:8000/tasks/*", (req) => {
      req.reply({
        body: {
          id: "test-task-id",
          title: "Updated Task Title",
          description: "Updated task description",
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }).as("updateTask");

    // Click on the task card to open the edit dialog
    cy.contains("Edit Test Task").click();

    // Clear and update the form fields
    cy.get('input[id="title"]').clear().type("Updated Task Title");
    cy.get('textarea[id="description"]')
      .clear()
      .type("Updated task description");

    // Submit the form
    cy.contains("button", "Save Changes").click();

    // Wait for the API call and verify the updated task appears
    cy.wait("@updateTask");
    cy.contains("Updated Task Title").should("be.visible");
  });

  it("should delete a task", () => {
    // Create a mock task
    cy.intercept("GET", "http://localhost:8000/tasks/", {
      body: [
        {
          id: "test-task-id",
          title: "Delete Test Task",
          description: "This task will be deleted",
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    }).as("getTasks");

    // Visit page to load mock task
    cy.visit("/");
    cy.wait("@getTasks");

    // Intercept task delete API call
    cy.intercept("DELETE", "http://localhost:8000/tasks/*", {
      statusCode: 204,
    }).as("deleteTask");

    // Click on the task card to open the edit dialog
    cy.contains("Delete Test Task").click();

    // Click the delete button
    cy.contains("button", "Delete").click();

    // Wait for the API call and verify the task is removed
    cy.wait("@deleteTask");
    cy.contains("Delete Test Task").should("not.exist");
  });
});
