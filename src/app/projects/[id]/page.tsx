import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { z } from "zod";
import DeleteProjectButton from "@/app/components/delete-project-button";
import KanbanBoard from "@/app/components/kanban-board";
import TaskForm from "@/app/components/task-form";
import { getProject, getTasks } from "@/lib/queries";
import { TaskPrioritySchema } from "@/lib/validation";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    return { title: "Project not found | Project Tracker" };
  }

  const project = await getProject(projectId);

  return {
    title: project
      ? `${project.name} | Project Tracker`
      : "Project not found | Project Tracker",
    description: project?.description || "View tasks and progress for this project.",
  };
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  const [{ id: rawId }, query] = await Promise.all([params, searchParams]);
  const projectId = Number(rawId);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    notFound();
  }

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const rawPriority = firstValue(query.priority);
  const priorityResult = TaskPrioritySchema.safeParse(rawPriority);
  const rawSearch = firstValue(query.q) ?? "";
  const searchResult = z.string().trim().max(120).safeParse(rawSearch);
  const priority = priorityResult.success ? priorityResult.data : "";
  const searchQuery = searchResult.success ? searchResult.data : "";
  const tasks = await getTasks(projectId, {
    ...(priorityResult.success ? { priority: priorityResult.data } : {}),
    ...(searchQuery ? { q: searchQuery } : {}),
  });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
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

      <section aria-label="Filter tasks" className="mt-8">
        <form
          action={`/projects/${project.id}`}
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
          method="get"
        >
          <label className="min-w-44 flex-1 text-sm font-medium text-zinc-700">
            Search tasks
            <input
              className="mt-1.5 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              defaultValue={searchQuery}
              maxLength={120}
              name="q"
              placeholder="e.g. design"
              type="search"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            Priority
            <select
              className="mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              defaultValue={priority}
              name="priority"
            >
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <button
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
            type="submit"
          >
            Apply filters
          </button>
          <Link
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            href={`/projects/${project.id}`}
          >
            Clear
          </Link>
        </form>
      </section>

      <section className="mt-8" aria-label="Task board">
        <KanbanBoard projectId={project.id} tasks={tasks} today={today} />
      </section>

      <section className="mt-10">
        <TaskForm projectId={project.id} />
      </section>
    </main>
  );
}
