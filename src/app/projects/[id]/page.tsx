import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteProjectButton from "@/app/components/delete-project-button";
import TaskActions from "@/app/components/task-actions";
import TaskForm from "@/app/components/task-form";
import { getProject, getTasks } from "@/lib/queries";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const projectId = Number(rawId);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    notFound();
  }

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const tasks = await getTasks(projectId);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
      <Link
        className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        href="/"
      >
        &larr; All projects
      </Link>
      <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div
          aria-hidden="true"
          className="h-2"
          style={{ backgroundColor: project.color }}
        />
        <div className="flex flex-wrap items-start justify-between gap-5 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Project
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              {project.description || "No description provided."}
            </p>
          </div>
          <DeleteProjectButton projectId={project.id} />
        </div>
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Tasks
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {project.done_count} of {project.task_count} complete
              </p>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
              <h3 className="font-semibold text-zinc-900">No tasks yet</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Add a task to start tracking this project.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  key={task.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-semibold text-zinc-950">{task.title}</h3>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700">
                      {task.priority} priority
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
                    <span className="capitalize">
                      {task.status === "doing" ? "In progress" : task.status}
                    </span>
                    {task.due_date && (
                      <time dateTime={task.due_date}>
                        Due {task.due_date}
                      </time>
                    )}
                  </div>
                  <TaskActions projectId={project.id} task={task} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <TaskForm projectId={project.id} />
      </div>
    </main>
  );
}
