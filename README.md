# Project Tracker

A Next.js App Router project and task tracker backed by Neon Postgres.

## Features

- View projects with their color, description, task totals, and completion progress.
- Create projects and tasks; update task status or delete tasks and projects.
- Manage tasks on a three-column Kanban board with optimistic status moves.
- Filter a project's tasks by priority and title using URL search parameters.
- Review overall totals, task status and priority charts, overdue tasks, and per-project completion at `/stats`.
- Validate form input with Zod and use parameterized SQL for database operations.

## Stack

- Next.js 16 App Router and React 19 Server and Client Components
- TypeScript and Tailwind CSS
- Neon Postgres with `@neondatabase/serverless`
- Zod for input validation and database result validation

## Architecture

- **Reads:** Server Components call typed functions in `src/lib/queries.ts`, which run parameterized tagged-template queries through the server-only Neon client in `src/lib/db.ts`.
- **Writes:** Client forms and board controls call Server Actions in `src/app/actions.ts`. Actions validate their `FormData` with Zod, perform parameterized SQL mutations, and revalidate affected routes.
- **Database:** `database/migrations/001_create_projects_and_tasks.sql` defines the schema and sample records. Apply it once to a new database.

Neon's tagged-template interpolations are sent as SQL parameters, separate from the query text. User-provided values therefore remain values rather than being parsed as SQL. Keep SQL structure and identifiers fixed; interpolate data values using the `sql\`...\`` template.

## Setup

1. Create a Neon project and database. In the Neon dashboard, copy the connection string for the database.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to that connection string. Never commit `.env.local`.

   PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Run `database/migrations/001_create_projects_and_tasks.sql` once in the Neon SQL Editor. It creates the tables and inserts two sample projects and three tasks.
4. Install dependencies and start the app:

   ```bash
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

For Vercel, add `DATABASE_URL` to the project's Environment Variables for the environments you deploy, then deploy the app.

## Schema overview

- `projects`: serial primary key, required name (2–80 characters), description, hex color, and creation timestamp.
- `tasks`: serial primary key, required project foreign key with cascading delete, required title (2–140 characters), status (`todo`, `doing`, or `done`), priority (`low`, `medium`, or `high`), optional due date, and creation timestamp.
- An index on `tasks.project_id` supports project task lookups.

## Checks

```bash
npm run lint
npm run build
```
