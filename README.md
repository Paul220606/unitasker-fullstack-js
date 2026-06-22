# Unitasker

A full-stack task management web app built with the MERN stack. Users can create, track, and manage personal tasks with real-time deadline countdowns, OTP-based login, and a soft-delete bin system.

> Built to explore full-stack development end-to-end — from JWT auth and MongoDB data modeling to reusable React components and feature-based architecture.

🔗 **Live Demo:** [unitasker-fullstack-js.vercel.app](https://unitasker-fullstack-js.vercel.app)

---

## Features

**Authentication**
- Register and login with email or username
- Alternative login via OTP sent to email (nodemailer)
- JWT-based session management with protected routes

**Task Management**
- Create tasks with title, description, category, budget, due date, and status
- Edit task details and update status (Pending → In Progress → Completed / Canceled)
- Soft delete tasks to a recoverable Bin, or permanently delete them
- Restore tasks from the Bin — task numbering stays consistent automatically

**Dashboard & Filtering**
- Home dashboard showing recent tasks and a live countdown to the nearest deadline
- Stats overview: current, pending, completed, canceled, and deleted task counts
- Task list with filter by status and category, sort by multiple fields (asc/desc)
- Fuzzy search by task title (fuse.js)

**Security**
- Passwords hashed with bcrypt (salt rounds: 10) via Mongoose pre-save middleware
- JWT tokens verified on every protected API route

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Bootstrap 5, SCSS, React Router v7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Auth | JWT, bcrypt, nodemailer (OTP) |
| Libraries | fuse.js (fuzzy search), mongoose-delete (soft delete), axios |

---

## Project Structure

Feature-based architecture — each domain owns its own pages, API calls, and components.

```
client/src/
├── features/
│   ├── auth/          # Login, Register, OTP modal
│   ├── tasks/         # TaskList, NewTask, TaskBin
│   └── home/          # Dashboard, CompactBanner (deadline countdown)
├── shared/
│   ├── components/    # Table, FormModal, FormBuilder, StatsDisplay, Header
│   ├── hooks/         # useFetchingData, usePreviousPath
│   └── utils/         # Input validation, date conversion, toast helpers

server/src/
├── controllers/       # AuthController, TaskController, SiteController
├── models/            # User, Task, Counter, UserOTPVerification
├── middlewares/       # authMiddleware (JWT verification)
├── routes/            # authRouter, taskRouter, siteRouter
├── helpers/           # createJWT, createOTP, checkNull, validateUniqueness
└── configs/           # MongoDB connection, env, mail transporter
```

---

## Getting Started

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas)

```bash
# Clone the repo
git clone https://github.com/Paul220606/unitasker-fullstack-js.git
cd unitasker-fullstack-js
```

**Backend**
```bash
cd server
npm install
```

Create `server/.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

```bash
npm start
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Roadmap

- [ ] Deploy to Render (backend) + Vercel (frontend)
- [ ] AI feature: auto-suggest task category and priority using Gemini API
- [ ] User profile page
- [ ] Migrate to TypeScript
