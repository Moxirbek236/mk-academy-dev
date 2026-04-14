# MK Academy

MK Academy is a full-stack CEFR learning platform for English education centers. The project contains a NestJS backend, a Next.js frontend, Prisma database schema, role-based dashboards, course/group management, vocabulary practice, tasks, tests, finance tracking, notifications, PWA support, and Capacitor mobile builds.

The application is built for multi-role usage:

- `SUPERADMIN`: full system access, users, finance, system health, settings.
- `ADMIN`: center operations, leads, users, groups, courses, finance, settings.
- `TEACHER`: student monitoring, groups, tasks, tests, results.
- `STUDENT`: learning dashboard, groups, courses, books, vocabulary, tasks, results.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [Database Overview](#database-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Useful Scripts](#useful-scripts)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Seed and Demo Data](#seed-and-demo-data)
- [PWA and Mobile Builds](#pwa-and-mobile-builds)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)

## Features

### Public Website and SEO

- Public landing page for MK Academy.
- Public study request form through leads.
- SEO metadata, Open Graph data, structured data, `robots.txt`, and `sitemap.xml`.
- Dynamic center branding from backend settings.
- Multilingual foundation with Uzbek, Russian, and English messages.

### Authentication and Roles

- Phone/password login.
- JWT-based API authentication.
- Role guards on protected backend endpoints.
- Frontend role-based navigation and route protection.
- Persistent auth storage for web and native Capacitor runtime.

### Dashboards

- Role-aware dashboard screen.
- Superadmin/admin summaries.
- Teacher/mentor monitoring views.
- Student learning overview.
- Backend dashboard stats endpoint.

### User Management

- Create teachers, students, and admins.
- Upload user avatars.
- View users according to current role scope.
- Activate/deactivate users.
- Current user profile and profile update APIs.

### Courses and Groups

- Create, update, list, and soft-delete courses.
- CEFR levels: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
- Create and manage groups.
- Assign courses to groups.
- Add or remove students from groups.
- View group members and group-specific courses.

### Learning Content

- Course detail pages.
- Group detail pages.
- Student learning page.
- Books library and book viewer.
- Unit pages for vocabulary and tasks.

### Vocabulary

- Vocabulary CRUD.
- Vocabulary progress tracking per student.
- Word list support.
- Vocabulary practice page on frontend.
- Data model prepared for spaced repetition fields such as `easeFactor`, `intervalDays`, `nextReviewAt`, `correctCount`, and `wrongCount`.

### Tasks and Tests

- Task CRUD.
- Task attachments.
- Student task submissions.
- Test CRUD.
- Questions per test.
- Test attempts and student attempt history.
- Results page reads dashboard/test attempt data.

### Gamification

- Achievements.
- XP transactions.
- Leaderboard support.
- Rank lookup.

### Finance

- Income/expense transactions.
- Student balance endpoint.
- Admin/superadmin finance dashboard.
- Transaction history.

### Notifications

- Notification feed for current user.
- Mark one notification as read.
- Mark all notifications as read.
- Delete notification.
- Frontend notification provider and device notification permission flow.

### Offline and Native Support

- Axios GET cache for offline reads.
- Offline banner and API notices.
- PWA service worker through `@ducanh2912/next-pwa`.
- Capacitor Android and iOS projects.
- GitHub Actions workflows for Android/iOS builds.

## Tech Stack

### Backend

- Node.js
- NestJS 11
- TypeScript
- Prisma 6
- SQLite
- JWT authentication
- bcrypt password hashing
- Swagger/OpenAPI
- Multer file uploads
- Jest testing

### Frontend

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- next-intl
- Axios
- PWA support
- Capacitor Android/iOS
- Framer Motion
- Recharts
- Lucide React icons

### Tooling and Deployment

- Netlify plugin for Next.js
- Cloudflare Pages compatible frontend URL configuration
- Render-compatible backend URL defaults
- GitHub Actions mobile build workflows

## Repository Structure

```text
mk-academy/
  backend/
    prisma/
      schema.prisma
      seed.ts
      populate.ts
      migrations/
    src/
      common/
      core/
      models/
      main.ts
      app.module.ts
    package.json
    .env.example

  frontend/
    src/
      app/
      hooks/
      i18n/
      lib/
      messages/
      mocks/
    android/
    ios/
    public/
    scripts/
    capacitor.config.ts
    next.config.ts
    netlify.toml
    package.json
    .env.example

  .github/
    workflows/
```

## Backend Overview

The backend is a NestJS API. All routes are prefixed with `/api`.

Main entry points:

- `backend/src/main.ts`: Nest bootstrap, CORS, global prefix, Swagger, validation pipe.
- `backend/src/app.module.ts`: global config, JWT, Prisma, and feature modules.
- `backend/src/core/config/prisma.service.ts`: Prisma service.
- `backend/src/common/guards/auth.guard.ts`: JWT auth guard.
- `backend/src/common/guards/role.guard.ts`: role-based guard.
- `backend/src/models/*`: domain modules.

Important backend modules:

- `auth`: login and logout.
- `user`: users, profile, role-scoped user lists.
- `user-profile`: extended profile data.
- `course`: course CRUD.
- `group`: groups, group members, assignments, group-course relations.
- `book`: books library.
- `vocabulary`: words, word lists, progress.
- `task`: task templates, student tasks, attachments.
- `test`: tests, questions, attempts.
- `gamification`: achievements, XP, leaderboard.
- `notification`: notification feed.
- `finance`: student balances and transactions.
- `system`: health and server stats.
- `lead`: landing page requests.
- `dashboard`: dashboard statistics.
- `center-settings`: public and private center branding.

Swagger is available at:

```text
http://localhost:<PORT>/api
```

Example with the default `.env.example` port:

```text
http://localhost:3232/api
```

## Frontend Overview

The frontend is a Next.js App Router application.

Main frontend areas:

- `src/app/page.tsx`: public home page.
- `src/app/landing/page.tsx`: landing route with canonical SEO path.
- `src/app/login/page.tsx`: phone/password login.
- `src/app/dashboard/page.tsx`: role-aware dashboard.
- `src/app/users/page.tsx`: user management.
- `src/app/courses/page.tsx`: course list and management.
- `src/app/groups/page.tsx`: groups list.
- `src/app/groups/[id]`: group detail.
- `src/app/learning/page.tsx`: student learning.
- `src/app/books/page.tsx`: books.
- `src/app/tasks/page.tsx`: task management.
- `src/app/results/page.tsx`: results and test attempts.
- `src/app/finance/page.tsx`: finance dashboard.
- `src/app/leads/page.tsx`: lead management.
- `src/app/system/page.tsx`: system health.
- `src/app/settings/*`: profile, center settings, email/settings placeholders.
- `src/app/notifications/page.tsx`: notifications.
- `src/app/vocabulary-practice/page.tsx`: vocabulary practice.

Important frontend libraries:

- `src/lib/api.ts`: Axios client, auth header, offline cache fallback.
- `src/lib/api-url.ts`: environment-aware API URL resolver.
- `src/lib/auth-storage.ts`: web/native token storage.
- `src/lib/role-access.ts`: route and capability rules.
- `src/lib/navigation-config.ts`: role-based sidebar and bottom navigation.
- `src/lib/seo.ts`: SEO metadata helper.
- `src/i18n/*`: locale routing and message loading.
- `src/mocks/*`: mock API and demo data when mock mode is enabled.

Supported locales:

- `uz`
- `ru`
- `en`

Default locale:

```text
uz
```

## Database Overview

The backend uses Prisma with SQLite.

Current datasource:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Main domain models:

- `User`
- `RefreshToken`
- `UserProfile`
- `Group`
- `GroupMember`
- `GroupAssignment`
- `Course`
- `GroupCourse`
- `Book`
- `Rating`
- `Vocabulary`
- `VocabularyProgress`
- `WordList`
- `WordListItem`
- `Task`
- `StudentTask`
- `TaskAttachment`
- `Test`
- `Question`
- `TestAttempt`
- `QuestionAnalytics`
- `Achievement`
- `StudentAchievement`
- `XpTransaction`
- `Leaderboard`
- `Notification`
- `SystemStats`
- `Lead`

The project also has a migration for `center_settings`, used by the center branding API.

## Getting Started

### Prerequisites

Install:

- Node.js 22 or newer
- npm
- Git

For mobile builds:

- Android Studio and Android SDK for Android.
- Xcode on macOS for iOS.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mk-academy
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Recommended local backend `.env`:

```env
JWT_SECRET="replace_this_with_a_local_secret"
JWT_EXPIRES_IN="30d"
BCRYPT_SALT=10
FRONTEND_URL="http://localhost:3000"
DATABASE_URL="file:./prisma/dev.db"
PORT=3232
```

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Seed default superadmin and center settings:

```bash
npm run seed
```

Run backend:

```bash
npm run start:dev
```

Backend should be available at:

```text
http://localhost:3232/api
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Recommended local frontend `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3232/api
NEXT_PUBLIC_NATIVE_API_URL=https://mk-academy-dev.onrender.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_USE_MOCK_DATA=false
CAPACITOR_EXPORT=false
```

Run frontend:

```bash
npm run dev
```

Frontend should be available at:

```text
http://localhost:3000
```

## Environment Variables

### Backend

| Variable | Description | Example |
| --- | --- | --- |
| `JWT_SECRET` | Secret key used to sign JWT tokens. Change this in production. | `replace_this_secret` |
| `JWT_EXPIRES_IN` | Token lifetime value. | `30d` |
| `BCRYPT_SALT` | bcrypt salt rounds. | `10` |
| `FRONTEND_URL` | Main allowed frontend origin for CORS. | `http://localhost:3000` |
| `FRONTEND_URLS` | Optional comma-separated extra CORS origins. | `https://site1.com,https://site2.com` |
| `DATABASE_URL` | SQLite database path for Prisma. | `file:./prisma/dev.db` |
| `PORT` | Backend API port. | `3232` |

### Frontend

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL for web runtime. | `http://localhost:3232/api` |
| `NEXT_PUBLIC_NATIVE_API_URL` | Backend API base URL for native Capacitor runtime. | `https://mk-academy-dev.onrender.com/api` |
| `NEXT_PUBLIC_APP_URL` | Public website URL used for SEO, sitemap, robots, canonical links. | `http://localhost:3000` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token. | empty or token |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Enables frontend mock API adapter. | `false` |
| `NEXT_PUBLIC_APP_ROLE` | Capacitor app flavor role. | `student` |
| `CAPACITOR_EXPORT` | Enables static export mode for native builds. | `false` |

## Useful Scripts

### Backend Scripts

Run from `backend/`.

| Command | Description |
| --- | --- |
| `npm run seed` | Creates default superadmin and default center settings. |
| `npm run prisma:generate` | Generates Prisma client. |
| `npm run build` | Generates Prisma client and builds NestJS. |
| `npm run start` | Starts built app from `dist`. |
| `npm run start:dev` | Starts NestJS in watch mode. |
| `npm run start:prod` | Starts production build. |
| `npm run lint` | Runs ESLint with auto-fix. |
| `npm run test` | Runs unit tests. |
| `npm run test:e2e` | Runs e2e tests. |
| `npm run test:cov` | Runs tests with coverage. |

### Frontend Scripts

Run from `frontend/`.

| Command | Description |
| --- | --- |
| `npm run dev` | Starts Next.js development server. |
| `npm run build:next` | Runs `next build`. |
| `npm run build` | Runs custom build wrapper. |
| `npm run start` | Starts production Next.js server. |
| `npm run cap-sync` | Builds Next.js and runs Capacitor sync. |
| `npm run cap-android` | Opens Android project through Capacitor. |
| `npm run lint` | Runs configured Next lint command. |

## API Overview

All API endpoints are under:

```text
/api
```

### Main Endpoint Groups

| Group | Important endpoints | Purpose |
| --- | --- | --- |
| Auth | `POST /auth/login`, `POST /auth/logout` | Login/logout. |
| Dashboard | `GET /dashboard/stats` | Role-aware dashboard statistics. |
| Users | `GET /users`, `POST /users/create/student`, `POST /users/create/teacher`, `POST /users/create/admin`, `GET /users/profile`, `PATCH /users/profile` | User and profile management. |
| User Profiles | `GET /user-profiles/profile/me`, `PUT /user-profiles/profile/update` | Extended profile data and avatar update. |
| Courses | `GET /courses`, `GET /courses/:id`, `POST /courses/create`, `PATCH /courses/:id`, `DELETE /courses/:id` | Course CRUD. |
| Groups | `GET /groups`, `GET /groups/:id`, `POST /groups`, `PATCH /groups/:id`, `DELETE /groups/:id` | Group CRUD. |
| Group Members | `POST /group-members/:groupId/add/:studentId`, `DELETE /group-members/:groupId/remove/:studentId`, `GET /group-members/:groupId` | Membership management. |
| Group Course | `GET /group-course`, `POST /group-course`, `PATCH /group-course/:id`, `DELETE /group-course/:id` | Assign courses to groups. |
| Books | `GET /books`, `GET /books/:id`, `POST /books`, `PATCH /books/:id`, `DELETE /books/:id` | Books library. |
| Vocabulary | `GET /vocabularies`, `GET /vocabularies/:id`, `POST /vocabularies`, `PATCH /vocabularies/:id`, `DELETE /vocabularies/:id` | Vocabulary CRUD. |
| Vocabulary Progress | `POST /vocabulary-progress/:studentId/word/:wordId`, `GET /vocabulary-progress/student/:studentId` | Student word progress. |
| Word Lists | `POST /word-lists/user/:userId`, `GET /word-lists/user/:userId` | Custom word lists. |
| Tasks | `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` | Task templates. |
| Student Tasks | `POST /student-tasks/submit/:studentId/:taskId`, `GET /student-tasks/student/:studentId` | Student task submission and list. |
| Tests | `GET /tests`, `GET /tests/:id`, `POST /tests`, `PATCH /tests/:id`, `DELETE /tests/:id`, `GET /tests/my-attempts` | Tests and current user attempts. |
| Questions | `POST /questions/test/:testId`, `GET /questions/test/:testId`, `PATCH /questions/:id`, `DELETE /questions/:id` | Test questions. |
| Test Attempts | `POST /test-attempts/submit`, `GET /test-attempts/student/:id` | Attempt submission and history. |
| Finance | `GET /finance/summary`, `GET /finance/transactions`, `POST /finance/transaction`, `GET /finance/student/:id/balance` | Finance tracking. |
| Notifications | `GET /notifications/me`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`, `DELETE /notifications/:id` | Notification feed. |
| Leads | `POST /leads`, `GET /leads`, `PATCH /leads/:id/status`, `DELETE /leads/:id` | Landing page requests. |
| Ratings | `GET /ratings`, `GET /ratings/target`, `POST /ratings`, `DELETE /ratings/:id` | Ratings and reviews. |
| Gamification | `GET /achievements`, `GET /leaderboard`, `POST /xp/add/:userId`, `GET /xp/rank/:userId` | Achievements, XP, leaderboard. |
| System | `GET /system/health`, `GET /system/stats` | API health and server resource stats. |
| Center Settings | `GET /center-settings/public`, `GET /center-settings`, `PATCH /center-settings` | Public/private branding settings. |

For exact request/response schemas, open Swagger:

```text
http://localhost:3232/api
```

## Authentication

Login request:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "phone": "+998917940303",
  "password": "mcacademy"
}
```

Successful response:

```json
{
  "success": true,
  "token": "<jwt-token>"
}
```

Protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

## Seed and Demo Data

### Backend Seed

`npm run seed` creates:

| Role | Phone | Password |
| --- | --- | --- |
| Super Admin | `+998917940303` | `mcacademy` |

This account is for local development. Change credentials before real deployment.

### Optional Populate Script

`backend/prisma/populate.ts` contains richer demo data:

- Teacher: `+998901112233`, password `teacher123`
- Student: `+998909998877`, password `student123`
- Example group, courses, tests, vocabulary, and books

It is not wired to a package script by default. You can run it manually with `ts-node` if needed.

### Frontend Mock Mode

The frontend can use a mock API adapter:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Mock users are defined in:

```text
frontend/src/mocks/mock-data.ts
```

Useful mock credentials include:

| Role | Phone | Password |
| --- | --- | --- |
| Superadmin | `+998903333333` | `super123` |
| Admin | `+998902222222` | `admin123` |
| Teacher | `+998901111111` | `teacher123` |
| Student | `+998901234567` | `student123` |

## PWA and Mobile Builds

The frontend supports PWA and native builds through Capacitor.

### PWA

PWA is configured in:

```text
frontend/next.config.ts
frontend/src/app/manifest.ts
```

PWA is disabled in development and when `CAPACITOR_EXPORT=true`.

### Android/iOS

Capacitor config:

```text
frontend/capacitor.config.ts
```

Static export mode:

```bash
CAPACITOR_EXPORT=true npm run build
npx cap sync
```

Android:

```bash
cd frontend
CAPACITOR_EXPORT=true npm run build
npx cap sync android
npx cap open android
```

iOS:

```bash
cd frontend
CAPACITOR_EXPORT=true npm run build
npx cap sync ios
```

The app ID and app name can be role-specific through:

```env
NEXT_PUBLIC_APP_ROLE=student
```

Supported build matrix in GitHub Actions:

- `student`
- `mentor`
- `admin`
- `superadmin`

## Deployment

### Backend Deployment

Recommended environment variables:

```env
JWT_SECRET="strong_production_secret"
JWT_EXPIRES_IN="30d"
BCRYPT_SALT=10
FRONTEND_URL="https://your-frontend-domain.com"
FRONTEND_URLS="https://your-extra-domain.com"
DATABASE_URL="file:/tmp/mk-academy.db"
PORT=3001
```

Build command:

```bash
npm install
npm run build
```

Start command:

```bash
npm run start:prod
```

Important production note: the current Prisma datasource is SQLite. SQLite is simple for prototypes, but for a serious multi-user production app PostgreSQL is recommended.

### Frontend Deployment

Netlify config exists at:

```text
frontend/netlify.toml
```

Build command:

```bash
npm run build
```

Publish directory:

```text
.next
```

Recommended frontend environment:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_USE_MOCK_DATA=false
CAPACITOR_EXPORT=false
```

For Cloudflare Pages or static native export, set:

```env
CAPACITOR_EXPORT=true
```

## Testing

### Backend

```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

### Frontend

The frontend currently has build and lint scripts:

```bash
cd frontend
npm run build
npm run lint
```

## Troubleshooting

### PowerShell cannot run `npm`

If Windows PowerShell blocks `npm.ps1`, use:

```powershell
npm.cmd run dev
npm.cmd run build
```

### Frontend cannot connect to backend

Check that:

- Backend is running.
- Backend `PORT` matches frontend `NEXT_PUBLIC_API_URL`.
- Example: backend `PORT=3232`, frontend `NEXT_PUBLIC_API_URL=http://localhost:3232/api`.
- Browser console does not show CORS errors.
- Backend `FRONTEND_URL` includes the frontend origin.

### Swagger opens but protected requests fail

Login first, copy the JWT token, click `Authorize` in Swagger, and paste:

```text
Bearer <jwt-token>
```

### Prisma client errors

Regenerate Prisma client:

```bash
cd backend
npx prisma generate
```

If the database is missing tables:

```bash
npx prisma migrate dev
```

### Sitemap has only the homepage

The sitemap fetches courses from the API. If `/api/courses` requires authentication or returns `401`, only public static routes will be included. Make courses public for SEO or create a public active-courses endpoint if course pages must be indexed.

## Roadmap Ideas

- Move production database from SQLite to PostgreSQL.
- Add refresh-token flow to frontend and backend.
- Add public active courses endpoint for SEO-friendly sitemap.
- Add stronger file upload validation and external object storage.
- Complete spaced repetition review algorithm.
- Add writing/speaking feedback.
- Add classroom schedule and attendance.
- Add parent dashboard.
- Add certificate generation for passed exams.
- Add more automated frontend tests.

## License

This repository is currently marked as private/unlicensed in package metadata. Add a license file before publishing as open source.

