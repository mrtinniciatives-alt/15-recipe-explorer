import Link from "next/link";
import {
  getDashboardStats,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/queries";

const statuses: { key: TaskStatus; label: string; color: string }[] = [
  { key: "todo", label: "To do", color: "bg-slate-500" },
  { key: "doing", label: "Doing", color: "bg-amber-500" },
  { key: "done", label: "Done", color: "bg-emerald-500" },
];

const priorities: { key: TaskPriority; label: string; color: string }[] = [
  { key: "low", label: "Low", color: "bg-sky-500" },
  { key: "medium", label: "Medium", color: "bg-amber-500" },
  { key: "high", label: "High", color: "bg-rose-500" },
];

export default async function StatsPage() {
  const stats = await getDashboardStats();
  const completion =
    stats.task_count === 0
      ? 0
      : Math.round((stats.done_count / stats.task_count) * 100);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
      <Link
        className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        href="/"
      >
        &larr; All projects
      </Link>
      <header className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Overview
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Project statistics
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          A snapshot of tasks, priorities, and project progress.
        </p>
      </header>

      <section
        aria-label="Overall totals"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Projects", value: stats.project_count },
          { label: "Total tasks", value: stats.task_count },
          { label: "Completed", value: `${stats.done_count} · ${completion}%` },
          { label: "Overdue", value: stats.overdue_count },
        ].map((item) => (
          <article
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            key={item.label}
          >
            <p className="text-sm font-medium text-zinc-600">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-zinc-950">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Chart
          title="Tasks by status"
          rows={statuses.map((status) => ({
            label: status.label,
            count:
              stats.status_counts.find((item) => item.status === status.key)
                ?.count ?? 0,
            color: status.color,
          }))}
          total={stats.task_count}
        />
        <Chart
          title="Tasks by priority"
          rows={priorities.map((priority) => ({
            label: priority.label,
            count:
              stats.priority_counts.find(
                (item) => item.priority === priority.key,
              )?.count ?? 0,
            color: priority.color,
          }))}
          total={stats.task_count}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Completion by project
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Completed tasks as a share of each project&apos;s tasks.
            </p>
          </div>
          <span className="text-sm text-zinc-500">
            {stats.project_completion.length}{" "}
            {stats.project_completion.length === 1 ? "project" : "projects"}
          </span>
        </div>
        {stats.project_completion.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
            No projects to report yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-5">
            {stats.project_completion.map((project) => (
              <li key={project.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    className="font-semibold text-zinc-900 hover:text-indigo-700"
                    href={`/projects/${project.id}`}
                  >
                    {project.name}
                  </Link>
                  <span className="text-sm tabular-nums text-zinc-600">
                    {project.done_count}/{project.task_count} tasks ·{" "}
                    {project.completion_percent}%
                  </span>
                </div>
                <div
                  aria-label={`${project.name}: ${project.completion_percent}% complete`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={project.completion_percent}
                  className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100"
                  role="progressbar"
                >
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{
                      width: `${project.completion_percent}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Overdue tasks
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Unfinished tasks with a due date before today.
            </p>
          </div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
            {stats.overdue_count}
          </span>
        </div>
        {stats.overdue_tasks.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
            No overdue tasks. You&apos;re all caught up.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-zinc-100">
            {stats.overdue_tasks.map((task) => (
              <li
                className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                key={task.id}
              >
                <div>
                  <Link
                    className="font-semibold text-zinc-900 hover:text-indigo-700"
                    href={`/projects/${task.project_id}`}
                  >
                    {task.title}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-600">
                    {task.project_name}
                  </p>
                </div>
                <time
                  className="text-sm font-semibold text-red-700"
                  dateTime={task.due_date}
                >
                  Due {task.due_date}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Chart({
  title,
  rows,
  total,
}: {
  title: string;
  rows: { label: string; count: number; color: string }[];
  total: number;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h2>
      <ul className="mt-6 space-y-5">
        {rows.map((row) => {
          const percentage =
            total === 0 ? 0 : Math.round((row.count / total) * 100);

          return (
            <li key={row.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-zinc-700">{row.label}</span>
                <span className="tabular-nums text-zinc-600">
                  {row.count} · {percentage}%
                </span>
              </div>
              <div
                aria-label={`${row.label}: ${row.count} tasks, ${percentage}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={percentage}
                className="h-3 overflow-hidden rounded-full bg-zinc-100"
                role="progressbar"
              >
                <div
                  className={`h-full rounded-full transition-[width] ${row.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
