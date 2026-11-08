"use client";

import { useActionState } from "react";
import { createProject, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: true, errors: {} };

export default function ProjectForm() {
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">New project</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          Name
          <input
            aria-describedby={state.errors.name ? "project-name-error" : undefined}
            aria-invalid={Boolean(state.errors.name?.length)}
            className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            maxLength={80}
            minLength={2}
            name="name"
            required
          />
          {state.errors.name?.length ? (
            <span className="mt-1 block text-xs text-red-700" id="project-name-error">
              {state.errors.name.join(" ")}
            </span>
          ) : null}
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Description
          <textarea
            className="mt-2 block min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            maxLength={2000}
            name="description"
            rows={3}
          />
          {state.errors.description?.map((error) => (
            <span className="mt-1 block text-xs text-red-700" key={error}>
              {error}
            </span>
          ))}
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Accent color
          <input
            aria-describedby={state.errors.color ? "project-color-error" : undefined}
            aria-invalid={Boolean(state.errors.color?.length)}
            className="mt-2 block h-11 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white p-1"
            defaultValue="#6366f1"
            name="color"
            type="color"
          />
          {state.errors.color?.length ? (
            <span className="mt-1 block text-xs text-red-700" id="project-color-error">
              {state.errors.color.join(" ")}
            </span>
          ) : null}
        </label>
      </div>
      {state.errors.form?.map((error) => (
        <p className="mt-4 text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {state.message && (
        <p className="mt-4 text-sm text-emerald-700" role="status">
          {state.message}
        </p>
      )}
      <button
        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Creating..." : "Create project"}
      </button>
    </form>
  );
}
