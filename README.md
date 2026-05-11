<h1 align="center">
  <br />
  ☑️ Task Manager
  <br />
</h1>

<h4 align="center">A high-fidelity, premium SaaS project management platform built with the MERN stack.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#design-philosophy">Design Philosophy</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a>
</p>

---

## Overview

**Task Manager** is a state-of-the-art, role-based project management SaaS application designed for modern teams who prioritize both productivity and aesthetic excellence. Featuring a **high-fidelity, banking-inspired interface**, Task Manager offers a seamless experience across all devices with specialized workflows for **Admins** and **Members**.

The platform is built on the MERN stack and features a unique **Interactive Hover-Expand Sidebar**, real-time data visualization, and a robust Kanban board for fluid task management.

---

## Features

### ✨ Interactive Sidebar (Banking Style)
- **Compact View**: A minimalist icon-only rail that maximizes workspace breathability.
- **Auto-Expansion**: Smoothly expands on hover to reveal labels, section headers, and user profiles.
- **Content Pushing**: The main content area intelligently shifts to accommodate the sidebar, preventing visual overlap.

### 🔐 Authentication & Security
- **Premium Split-Screen Auth**: Modern login/signup pages with an auto-sliding illustration carousel.
- **JWT-based Security**: Secure token-based authentication with role-based access control.
- **First-Login Force**: Invited members are required to change their temporary password upon their first entry.

### 👑 Admin Dashboard
- **Aggregate Metrics**: Live tracking of total projects, team velocity, and task completion.
- **Team Administration**: High-fidelity member management with role badges and invitation controls.
- **Global Overview**: A bird's-eye view of all ongoing activities across the organization.

### 👤 Member Dashboard
- **Personal Productivity**: Tailored stats focusing on assigned tasks and upcoming deadlines.
- **My Tasks**: A focused view of "To-Do" items with priority indicators.
- **Project Scope**: Access to only the projects and tasks the member is assigned to.

### 📋 Task & Project Management
- **Kanban Board**: Drag-and-drop tasks across `To Do`, `In Progress`, `Review`, and `Completed`.
- **Project Cards**: Clean, card-based layouts with integrated progress indicators.
- **Task Details**: Sliding drawers for deep-diving into task descriptions, priorities, and assignees.

---

## Design Philosophy

Task Manager follows a **High-Fidelity "Banking" Aesthetic**:
- **Palette**: Pure White `#FFFFFF`, Soft Slate `#F8FAFC`, Emerald Green `#10B981`, and Deep Indigo `#0F172A`.
- **Typography**: Utilizing `Inter` for clarity and `Space Grotesk` for high-impact headings.
- **Interactions**: Subtle micro-animations, glassmorphism headers, and smooth transitions (300ms ease-in-out).
- **Layout**: Generous whitespace, thin borders (`#E2E8F0`), and a structured grid system.

---

## Tech Stack

### Frontend
- **React 18** (UI Library)
- **Tailwind CSS 4.0** (Styling)
- **Vite** (Build Tool)
- **Lucide React** (Iconography)
- **React Router 6** (Navigation)
- **Axios** (API Requests)

### Backend
- **Node.js & Express** (Runtime & Framework)
- **MongoDB & Mongoose** (Database & ODM)
- **JSON Web Tokens** (Authentication)
- **Bcrypt.js** (Password Hashing)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
Run `npm run dev` to start the API.

### 3. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

<p align="center">Built for modern teams with ❤️</p>
