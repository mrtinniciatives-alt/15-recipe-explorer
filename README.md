# Project Tracker

Project Tracker is a Next.js App Router application that reads project and task
data from Neon Postgres.

## Run locally

Use Node.js 20 or later, install dependencies, and add your Neon connection
string to `.env.local`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

Then start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app shows projects with
their descriptions, color accents, and completed-task progress. Create projects
from the home page, then open a project to add, update, and delete tasks.

## Database setup

Apply [`database/migrations/001_create_projects_and_tasks.sql`](./database/migrations/001_create_projects_and_tasks.sql)
to your Neon database before opening the app. It creates the projects and tasks
tables and inserts sample rows.

The database connection is server-only and throws a clear error if
`DATABASE_URL` is missing. Queries use Neon tagged-template SQL; interpolated
values are sent as parameters separate from the SQL text rather than
concatenated into a query. This prevents user-supplied values from being
interpreted as SQL. Keep query structure and identifiers fixed, and pass
variable values through the template interpolations.

Form submissions are validated on the server with Zod before any mutation.
Task status changes and deletions match both the task ID and its project ID in
the SQL `WHERE` clause.

## Checks

```bash
npm run lint
npm run build
```
