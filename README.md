# ⏱️ TimeWise AI – Smart Time Management Assistant

A modern, responsive, full-stack web application designed for intelligent daily time management with natural-language task scheduling, AI priority confirmation, cascade conflict reorganization, real-time browser notifications with audio buzzer alerts, and personalized routine learning.

---

## 🌟 Master Features & Capabilities

### 1. Plain-Text Task Input
- Enter your daily schedule in plain everyday English.
- Example: *"I have an exam tomorrow, two assignments due today, a project to complete, and I want to exercise for 30 minutes."*
- Extracts task names, deadlines, estimated durations, categories, and identifies missing information.
- Asks interactive follow-up clarification questions for ambiguous details.
- Review and edit extracted tasks before confirming.

### 2. AI Priority Confirmation
- For every extracted task, explicitly asks: **“Is this task highly prioritized?”**
- Provides three clear options: **High, Medium, and Low**.
- Suggests priorities based on urgency and deadlines, allowing 1-click user overrides.
- Confirmed high-priority tasks are placed in early morning peak focus slots with extra duration buffers (+25%).

### 3. Intelligent Schedule Generator
- Automatically generates conflict-free daily and weekly timetables.
- Schedules high-priority tasks earlier whenever practical.
- Allocates extra buffer time based on task complexity without making unrealistic schedules.
- Fits tasks within configured working hours (e.g., 09:00 - 18:00).
- Inserts short breaks (10-15m) and focus blocks.
- Detects schedule conflicts and provides feasibility warnings when tasks exceed available working hours.

### 4. Smart Task Prioritization
- Ranks tasks using urgency, importance, deadlines, duration, and user preferences.
- Briefly explains the rationale behind each task's priority and time slot.
- Prevents low-priority tasks from delaying urgent, deadline-sensitive work.

### 5. Automatic Schedule Adjustment & Cascade Rescheduling
- Mark tasks as `completed`, `in-progress`, `postponed`, or `pending`.
- When a task takes longer or is postponed, automatically shifts subsequent overlapping tasks forward without conflict.
- Dedicated "Reorganize Unfinished Tasks" feature to reset behind-schedule days.
- Displays a clear Before/After Diff Dialog showing what changed in the updated schedule.

### 6. Smart Reminders and Alarms
- Sends timely reminders before scheduled tasks begin.
- Desktop browser notification support with in-app floating banner fallback.
- Web Audio API alarm system supporting **Digital Buzzer**, **Gentle Chime**, and **Soft Bell** alerts.
- Quick **Snooze (+10m)**, **Dismiss**, and **Complete** actions.

### 7. Productivity Analysis & Insights
- Tracks completed, pending, postponed, and overdue tasks.
- Compares estimated task durations with actual completion times.
- Daily & weekly interactive completion charts.
- Priority breakdown progress tracking.
- Actionable AI time management recommendations.

### 8. Conversational AI Assistant
- Dedicated chat interface with context awareness of today's tasks.
- Understands natural language commands:
  - *"Move my project work to 4 PM"*
  - *"Give my exam preparation more time"*
  - *"I could not finish my morning tasks. Reschedule the rest."*
  - *"I have three assignments due today and an exam tomorrow."*
  - *"What is next on my schedule?"*
- Directly modifies database schedules and displays visual change cards inside the chat.

### 9. Smart Break and Focus Planner
- Configurable Pomodoro and focus session intervals (25, 45, 50, 60 minutes).
- Customizable short rest breaks (5, 10, 15 minutes) and meal/long breaks (15, 30, 45 minutes).
- Automatically protects fixed appointments and urgent deadlines when placing breaks.

### 10. Personalized Routine Learning
- Analyzes historical completion times to calculate the user's velocity ratio.
- Identifies the user's peak cognitive focus window (e.g., 09:00 - 12:00).
- Adapts future schedules to habits without making unsupported assumptions.
- Allows users to review or reset routine learning preferences at any time.

---

## 🖥️ 10 Main Pages

| Page | Route | Description |
|------|-------|-------------|
| 1. Landing Page | `/` | Application overview, interactive live NLP demo simulator, 6 feature cards, and auth navigation. |
| 2. Register Page | `/register` | User signup with name, email, password strength, and timezone selector. |
| 3. Login Page | `/login` | JWT authentication with 1-click Demo Account login. |
| 4. Dashboard | `/dashboard` | Today's timeline, upcoming deadlines, next-up live task card, and priority KPI counters. |
| 5. AI Schedule Planner | `/planner` | Plain-text task input, AI follow-up clarification, priority confirmation, and schedule generator. |
| 6. My Schedule | `/schedule` | Daily & Weekly timetable views, task status controls, 1-click reorganize, and cascade reschedule diff. |
| 7. Task Management | `/tasks` | Full CRUD task table, search bar, status & priority filters, sorting, and batch actions. |
| 8. AI Assistant | `/assistant` | Context-aware conversational AI assistant with instant schedule adjustments and action cards. |
| 9. Productivity Analytics | `/analytics` | 7-day velocity charts, estimated vs actual duration comparison, peak focus hours, and AI suggestions. |
| 10. Settings & Profile | `/settings` | Working hours, focus & break planner, priority rules, reminder lead times, audio buzzer tester, and routine reset. |

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, React Icons, date-fns, react-hot-toast.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, Express-Validator, Express-Rate-Limit, node-cron.
- **Database**: MongoDB with Mongoose ODM (Auto-detected local mongod or MongoDB Atlas cloud).
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`) with an advanced offline rule-based NLP parser and cognitive heuristic scheduler fallback.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local mongod or free cloud MongoDB Atlas cluster)

### 1. Installation
From the root directory:
```bash
# Start the full application (automatically launches MongoDB, Backend, and Frontend)
node start-timewise.js
```
Or from inside the `smarttime` folder:
```bash
cd smarttime
npm start
```

### 2. Running Automated Tests
Run the comprehensive verification test suite covering authentication, plain-text NLP extraction, priority slotting, schedule conflicts, cascade rescheduling, and conversational AI:
```bash
node smarttime/backend/tests/test_timewise.js
```

### 3. Environment Variables (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/timewise
JWT_SECRET=timewise_super_secret_jwt_key_2026_secured
JWT_EXPIRE=7d
GEMINI_API_KEY=
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
*Note: If `GEMINI_API_KEY` is left blank, TimeWise AI's built-in intelligent NLP and heuristic engine operates locally with 100% full functionality.*

---

## 🔒 Security & Data Isolation
- Strictly scoped user ownership (`{ _id: taskId, userId: req.user._id }`) prevents cross-user access.
- Passwords hashed using bcrypt with salt rounds of 12.
- Secure JWT authentication with 7-day token expiration.
- CORS and Helmet protection configured on all backend API routes.
