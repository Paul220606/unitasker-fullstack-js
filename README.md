# Unitasker

A full-stack task management web app built with the MERN stack. Users can create, track, and manage personal tasks with real-time deadline countdowns, AI-assisted task creation, OTP-based authentication with optional two-factor login, and a soft-delete bin system — fully bilingual (English/Vietnamese).

> Built to explore full-stack development end-to-end — from JWT auth and MongoDB data modeling to reusable React components, i18n, and feature-based architecture — then hardened with abuse protection, measured performance work, accessibility fixes, and cross-browser end-to-end tests.

🔗 **Live Demo:** [unitasker-fullstack-js.vercel.app](https://unitasker-fullstack-js.vercel.app)

---

## Highlights

| Area | Result |
|---|---|
| Performance | Initial JS **340 kB → 199 kB** gzip (−42%), mobile Lighthouse Performance **89 → 96** |
| Accessibility | Lighthouse Accessibility **77 → 100** |
| Security | Hashed OTPs, atomic per-account OTP lockout, per-IP rate limiting |
| Testing | **20** backend integration tests + **42** end-to-end tests across **5 browser/device targets** |

---

## Features

**Authentication & Security**
- Register and login with email or username
- Passwords hashed with bcrypt (salt rounds: 10) via Mongoose pre-save middleware
- JWT-based session management, verified on every protected API route
- OTP email verification (nodemailer) for password reset
- Optional two-factor authentication (2FA) — when enabled, login requires a 6-digit email OTP in addition to the password before a session token is issued
- Server-side field validation with per-field error messages

**Abuse Protection**
- OTPs generated with a CSPRNG (`crypto.randomInt`) and stored **bcrypt-hashed**, never in plaintext
- **Per-account OTP lockout:** 5 attempts per code, enforced with a single atomic `findOneAndUpdate` + `$inc`, so concurrent guesses cannot exceed the limit (covered by a 20-parallel-request test)
- OTPs are deleted after successful use (no replay) and attempts reset on resend
- **Per-IP rate limiting** (`express-rate-limit`): OTP sending (3 / 15 min), login (10 failed attempts / 15 min), registration (5 / hour), with separate counters per route and `trust proxy` configured for the hosting proxy
- The client surfaces `429` responses through a central axios interceptor, so every form shows the lockout message instead of failing silently

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
- `<html lang>` stays in sync with the selected language so screen readers pronounce content correctly

**Mobile-friendly OTP entry**
- Numeric keyboard (`inputmode="numeric"`) and SMS/email code autofill (`autocomplete="one-time-code"`); an autofilled or pasted code is spread across all six boxes

---

## Performance & Accessibility

Measured with Lighthouse (mobile, median of 3 runs) on the deployed `/login` page.

| Metric | Before | After |
|---|---|---|
| Performance | 89 | **96** |
| Accessibility | 77 | **100** |
| Best Practices | 100 | **100** |
| JavaScript transferred | 340 kB | **199 kB** |
| First Contentful Paint | 2.87 s | **2.02 s** |
| Largest Contentful Paint | 2.87 s | **2.31 s** |
| Total Blocking Time | 121 ms | **39 ms** |
| Cumulative Layout Shift | 0 | **0** |

What changed:
- **Route-level code splitting** with `React.lazy` + `Suspense`, so each page is its own chunk
- **Lazy-loaded the `.docx` parser** (`mammoth`, ~130 kB gzip), now fetched only when a user actually imports a `.docx` file
- **Fixed a layout-shift regression** introduced by code splitting: the Suspense fallback moved the footer (CLS 0.18). The boundary now wraps page *and* footer inside the layout, so nothing already on screen moves when a page loads
- **Accessibility:** WCAG AA contrast on dark backgrounds, correct heading hierarchy, accessible names for icon buttons, a `<main>` landmark, keyboard-reachable controls, and valid list markup
- **SEO basics:** page title, meta description, and a valid `robots.txt`

---

## Testing

### Backend — Vitest + Supertest (20 tests)

Runs against an in-memory MongoDB (`mongodb-memory-server`) with the mail transporter mocked.

- Auth: register, login (username/email), guest login
- OTP: correct/wrong/expired codes, no replay after use, lockout after 5 attempts, **20 concurrent requests evaluate at most 5**, end-to-end 2FA flow asserting only a bcrypt hash is stored
- Rate limiting: 4th OTP send and 11th failed login within the window are rejected with `429`

```bash
cd server
npm test
```

### End-to-end — Playwright (42 tests, 5 targets)

Runs the **production build** against a mocked API layer (no backend or database needed) on Chromium, Firefox, WebKit, Pixel 7 and iPhone 14.

- Login form accessibility and password visibility toggle
- 2FA: a wrong code keeps the modal open and clears the boxes; the correct code logs in without leaving a stuck backdrop
- Lockout message shown after too many wrong codes (`429`)
- OTP autofill spreads across all boxes; numeric keyboard / autofill attributes present
- **Performance regression guards:** the `.docx` parser is not downloaded on `/login`, and lazy pages load with CLS < 0.1

```bash
cd client
npx playwright install   # first time only: downloads the browsers
npm run test:e2e         # WebKit targets run on a single worker for stability on Windows
npm run test:e2e:ui      # interactive mode
```

Bugs caught by the suite:
- The OTP **Confirm** button stayed disabled when a user opened `/login` directly (a global loading flag was initialised to `true`)
- WebKit-only intermittent failures traced to the API mock answering CORS **preflight** requests without CORS headers

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Bootstrap 5, SCSS, React Router v7, react-i18next |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Auth & Security | JWT, bcrypt, nodemailer (OTP + 2FA), express-rate-limit |
| AI | Google Gemini (`gemini-3.5-flash`) for task category/priority suggestions |
| Testing | Vitest, Supertest, mongodb-memory-server, Playwright |
| Libraries | fuse.js (fuzzy search), mongoose-delete (soft delete), mammoth (docx parsing for category import), axios |

---

## Project Structure

Feature-based architecture — each domain owns its own pages, API calls, and components.

```
client/
├── e2e/                  # Playwright specs + mocked API layer
├── playwright.config.js
└── src/
    ├── api/              # axios client (auth header, 401 redirect, 429 handling)
    ├── app/              # App, lazy-loaded route table
    ├── features/
    │   ├── auth/         # Login, Register, PinModal (OTP/2FA)
    │   ├── tasks/        # TaskList, TaskBin, NewTask
    │   ├── manager/      # Profile
    │   └── home/         # Dashboard, CompactBanner (deadline countdown)
    ├── shared/
    │   ├── components/   # Table, FormModal, FormBuilder, StatsDisplay, Header, Footer, PageLoader
    │   ├── layouts/      # DefaultLayout (Suspense boundary)
    │   ├── hooks/        # useFetchingData, usePreviousPath
    │   └── utils/        # Input validation, i18n translateItem, toast, downloadFile
    └── i18n/             # en.json, vi.json translation resources

server/src/
├── controllers/          # AuthController, TaskController, SiteController, AIController
├── models/               # User, Task, Counter, UserOTPVerification
├── middlewares/          # authMiddleware (JWT), rateLimiters
├── routes/               # authRouter, taskRouter, siteRouter
├── helpers/              # createJWT, createOTP, checkNull, validateUniqueness
├── configs/              # MongoDB connection, env, mail transporter, Gemini client
└── tests/                # auth, otp, rateLimit integration tests
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
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

```bash
npm start
```

**Frontend**
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Known Limitations

- Rate-limit counters live in server memory: they reset when the server restarts and are not shared across multiple instances. A shared store (e.g. Redis) is needed before scaling horizontally.
- `/auth/sendPin` currently reveals whether a username/email exists and returns the user id (user enumeration); fixing this requires changing the password-reset flow.
- Task list/bin export via "Export My Data" bypasses the default 30-item display cap (dedicated `/fullList` and `/fullBin` endpoints), but regular in-app browsing is still paginated at 30 items with no infinite scroll/pagination UI yet.
- User-entered content (task titles/descriptions, custom categories) is intentionally **not** machine-translated — only static UI strings and fixed enum values (status/priority) are localized, to avoid unnecessary AI cost/latency and translation drift on personal notes.
- Public profile pages are deferred — there is no user discovery/search feature yet, so a public profile view has no real use case in the app as it stands.

## Roadmap

- [ ] Redis-backed rate limiting for multi-instance deployments
- [ ] Run backend and E2E tests in CI (GitHub Actions) on every push
- [ ] Remove user enumeration from the password-reset flow
- [ ] Email notifications: task update confirmations, due-date reminders, and a weekly summary (requires a job scheduler, e.g. node-cron)
- [ ] Account deletion
- [ ] Public profile page (pending a user search/discovery feature)
- [ ] Pagination/infinite scroll for task list and bin beyond the current 30-item view
- [ ] Migrate to TypeScript