# Design Notes - Nexus Improvements

This document outlines the improvements made to Nexus, focusing on backend robustness, frontend type safety, and user experience, as per the requirements.

## Main Changes Implemented

### 1. Backend – Task DTOs & Validation

- **Change**: Introduced `CreateTaskDto` and `UpdateTaskDto` using `class-validator` decorators (`@IsString`, `@IsEnum`, `@IsDateString`, etc.).
- **Implementation**: Refactored `TasksController` to use these DTOs instead of `any`.

### 2. Backend – Auth Integration for Task Creation

- **Change**: Removed the reliance on the client sending the `user` object in the request body for task creation.
- **Implementation**: Updated the `create` method in `TasksController` to extract the authenticated user's ID directly from the request object (populated by the Auth Guard).

### 3. Backend – Controller Response Style & Error Handling

- **Change**: Refactored `TasksController` to remove manual `res.status().json()` calls.
- **Implementation**: Methods now return plain objects or promises. Standard NestJS exceptions (`NotFoundException`, `BadRequestException`) are used instead of manual error responses.

### 4. Frontend – RTK Query Cache Invalidation

- **Change**: Implemented a robust caching strategy using RTK Query tags.
- **Implementation**: Added `providesTags: ["Task"]` to queries and `invalidatesTags: ["Task"]` to mutations (`createTask`, `updateTask`, `deleteTask`).

### 5. Frontend – TypeScript Types & Type Safety

- **Change**: Centralized and strictly defined `Task`, `Comment`, and `User` types in `client/src/types`.
- **Implementation**: Removed `any` types from components (`TaskDetails`, `AddTask`, `Textbox`) and Redux slices. Added missing properties (`description`, `createdAt`) to interfaces.

### 6. Frontend – Dashboard UX & Empty States

- **Change**: Refactored the Dashboard to handle various data states gracefully.
- **Implementation**:
  - **Loading**: Displays a loading spinner while fetching data.
  - **Error**: Shows a user-friendly error message with a "Retry" button.
  - **Empty**: Displays clear messages and calls-to-action when no tasks are available.
  - **Polish**: Fixed visibility issues with "Normal" priority labels.

## Known Limitations & Future Improvements

- **Pagination**: The current API returns all tasks or filtered lists without pagination. For a production system with thousands of tasks, implementing server-side pagination would be critical for performance.
- **Testing**: While manual verification was performed, adding comprehensive unit and E2E tests (using Jest for backend and Cypress/Vitest for frontend) would be the next logical step to ensure long-term stability.
