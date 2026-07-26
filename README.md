# Unitasker

A full-stack task management web app built with the MERN stack. Users can create, track, and manage personal tasks with real-time deadline countdowns, AI-assisted task creation, OTP-based authentication with optional two-factor login, and a soft-delete bin system — fully bilingual (English/Vietnamese).

> Built to explore full-stack development end-to-end — from JWT auth and MongoDB data modeling to reusable React components, i18n, and feature-based architecture.

🔗 **Live Demo:** [unitasker-fullstack-js.vercel.app](https://unitasker-fullstack-js.vercel.app)

---

## Features

**Authentication & Security**
- Register and login with email or username
- Passwords hashed with bcrypt (salt rounds: 10) via Mongoose pre-save middleware
- JWT-based session management, verified on every protected API route
- OTP email verification (nodemailer) for password reset
- Optional two-factor authentication (2FA) — when enabled, login requires a 6-digit email OTP in addition to the password before a session token is issued
- Server-side field validation with per-field error messages

**Task Management**
- Create tasks with title, description, category, priority, budget, and due date
- AI-assisted task creation — suggests a category and priority from the title/description using Google Gemini
- Edit task details and update status (Pending → In Progress → Completed / Canceled)
- Soft delete tasks to a recoverable Bin, or permanently delete them; restoring keeps task numbering consistent automatically
- Custom, user-defined task categories (import/export as `.txt` or `.docx`)

**Dashboard & Filtering**
- Home dashboard with recent tasks and a live countdown to the nearest deadline
- Stats overview: current, pending, completed, canceled, and deleted task counts
- Task list with filter by status/category/priority, sort by any column (asc/desc), and fuzzy search by title (fuse.js)
- Responsive table with horizontal scroll for smaller viewports

**Profile & Data Ownership**
- Editable profile (name, username, email, phone, location, avatar)
- Export full account data (profile + all tasks, including bin) as JSON
- Export task categories as a plain-text file
- Toggle 2FA on/off from account settings

**Internationalization**
- Full English/Vietnamese UI via `react-i18next`, including form validation messages, toasts, and dynamic content translated from backend responses — with strict separation between display strings and raw values used for API calls/sorting/filtering, so switching language never changes app behavior

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Bootstrap 5, SCSS, React Router v7, react-i18next |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Auth | JWT, bcrypt, nodemailer (OTP + 2FA) |
| AI | Google Gemini (`gemini-3.5-flash`) for task category/priority suggestions |
| Libraries | fuse.js (fuzzy search), mongoose-delete (soft delete), mammoth (docx parsing for category import), axios |

---

## Project Structure

Feature-based architecture — each domain owns its own pages, API calls, and components.

```
client/src/
├── features/
│   ├── auth/          # Login, Register, PinModal (OTP/2FA)
│   ├── tasks/          # TaskList, TaskBin, NewTask
│   ├── manager/         # Profile
│   └── home/           # Dashboard, CompactBanner (deadline countdown)
├── shared/
│   ├── components/    # Table, FormModal, FormBuilder, StatsDisplay, Header
│   ├── hooks/          # useFetchingData, usePreviousPath
│   └── utils/           # Input validation, i18n translateItem, toast, downloadFile
├── i18n/               # en.json, vi.json translation resources

server/src/
├── controllers/       # AuthController, TaskController, SiteController, AIController
├── models/            # User, Task, Counter, UserOTPVerification
├── middlewares/       # authMiddleware (JWT verification)
├── routes/            # authRouter, taskRouter, siteRouter
├── helpers/            # createJWT, createOTP, checkNull, validateUniqueness
└── configs/            # MongoDB connection, env, mail transporter, Gemini client
```

---

## Getting Started

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas)

```bash
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
GEMINI_KEY=your_gemini_api_key
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

## Known Limitations

- Task list/bin export via "Export My Data" bypasses the default 30-item display cap (dedicated `/fullList` and `/fullBin` endpoints), but regular in-app browsing is still paginated at 30 items with no infinite scroll/pagination UI yet.
- User-entered content (task titles/descriptions, custom categories) is intentionally **not** machine-translated — only static UI strings and fixed enum values (status/priority) are localized, to avoid unnecessary AI cost/latency and translation drift on personal notes.
- Public profile pages are deferred — there is no user discovery/search feature yet, so a public profile view has no real use case in the app as it stands.

## Roadmap

- [ ] Email notifications: task update confirmations, due-date reminders, and a weekly summary (requires a job scheduler, e.g. node-cron)
- [ ] Account deletion
- [ ] Public profile page (pending a user search/discovery feature)
- [ ] Pagination/infinite scroll for task list and bin beyond the current 30-item view
- [ ] Migrate to TypeScript