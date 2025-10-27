# Nexus

A modern, full-stack task management application built with React, TypeScript, NestJS, and MySQL.

## 🚀 Live Demo
 [https://nexusfe.vercel.app](https://nexusfe.vercel.app)

## ✨ Features

### 📋 Task Management
- **Create & Manage Tasks** - Add tasks with titles, descriptions, priorities, and deadlines
- **Priority Levels** - High, Medium, Low priority classification with visual indicators
- **Task Stages** - Track progress through Todo, In Progress, and Completed stages
- **Due Date Tracking** - Set and monitor task deadlines
- **Task Assignment** - Assign tasks to team members

### 👥 Team Collaboration
- **Team Management** - Add and manage team members for each task
- **Assignment Tracking** - See which tasks are assigned to you

### 💬 Communication
- **Comments System** - Add comments and discussions to tasks

### 🎨 User Interface
- **Modern Design** - Clean, responsive interface built with Tailwind CSS
- **Board View** - Kanban-like board for visual task management
- **Task Cards** - Detailed task cards with all relevant information
- **Dark Theme** - Professional dark theme for better user experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🔐 Authentication & Security
- **User Authentication** - Secure login and registration system
- **JWT Tokens** - Secure authentication with JSON Web Tokens
- **Protected Routes** - Route protection for authenticated users
- **User Sessions** - Persistent user sessions

## 🛠️ Tech Stack

### Frontend
- **React** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux** - State management

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe server-side development
- **TypeORM** - Object-Relational Mapping
- **MySQL** - Relational database
- **JWT** - JSON Web Token authentication

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/sumadhar12/nexus.git
cd nexus
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Configure your .env file with:
# - Database connection details
# - JWT secret
# - Port configuration
# - Frontend URL for CORS
```

**Environment Variables (.env):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=nexus_sumadhar
JWT_SECRET=your_jwt_secret
PORT=8800
FRONTEND_URL=http://localhost:5173
```

```bash
# Run database migrations
npm run migration:run

# Start the development server
npm run start:dev
```

The backend will be available at `http://localhost:8800`

### 3. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your .env.local file:
VITE_APP_BACKEND_URL=http://localhost:8800
```

```bash
# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`
