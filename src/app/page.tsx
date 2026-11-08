import Link from "next/link";
import ProjectForm from "@/app/components/project-form";
import { getProjects } from "@/lib/queries";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
      <section className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Workspace
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Your projects
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              Keep work organized and see how each project is progressing.
            </p>
          </div>
          <p className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </section>

      {projects.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">No projects yet</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Projects will appear here once they have been added to your database.
          </p>
        </section>
      ) : (
        <section
          aria-label="Projects"
          className="grid gap-5 md:grid-cols-2"
        >
          {projects.map((project) => {
            const progress =
              project.task_count === 0
                ? 0
                : Math.round((project.done_count / project.task_count) * 100);

            return (
              <article
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                key={project.id}
              >
                <div
                  aria-hidden="true"
                  className="h-2"
                  style={{ backgroundColor: project.color }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                    <Link
                      className="rounded-sm hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      href={`/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                  </h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">
                    {project.description || "No description provided."}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-zinc-700">
                      Progress
                    </span>
                    <span className="tabular-nums text-zinc-600">
                      {project.done_count}/{project.task_count} tasks
                    </span>
                  </div>
                  <div
                    aria-label={`${progress}% complete`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={progress}
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100"
                    role="progressbar"
                  >
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-[width]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="mt-10">
        <ProjectForm />
      </section>
    </main>
  );
}
