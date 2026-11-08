"use client";

import { useActionState } from "react";
import { createTask, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: true, errors: {} };

export default function TaskForm({ projectId }: { projectId: number }) {
  const [state, formAction, pending] = useActionState(createTask, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <input name="projectId" type="hidden" value={projectId} />
      <h2 className="text-lg font-semibold text-zinc-950">New task</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          Title
          <input
            aria-describedby={state.errors.title ? "task-title-error" : undefined}
            aria-invalid={Boolean(state.errors.title?.length)}
            className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            maxLength={140}
            minLength={2}
            name="title"
            required
          />
          {state.errors.title?.length ? (
            <span className="mt-1 block text-xs text-red-700" id="task-title-error">
              {state.errors.title.join(" ")}
            </span>
          ) : null}
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Status
          <select
            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            defaultValue="todo"
            name="status"
          >
            <option value="todo">To do</option>
            <option value="doing">In progress</option>
            <option value="done">Done</option>
          </select>
          {state.errors.status?.map((error) => (
            <span className="mt-1 block text-xs text-red-700" key={error}>
              {error}
            </span>
          ))}
        </label>
        <label className="text-sm font-medium text-zinc-700">
          Priority
          <select
            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            defaultValue="medium"
            name="priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {state.errors.priority?.map((error) => (
            <span className="mt-1 block text-xs text-red-700" key={error}>
              {error}
            </span>
          ))}
        </label>
        <label className="text-sm font-medium text-zinc-700 sm:col-span-2">
          Due date
          <input
            aria-describedby={state.errors.due_date ? "task-due-date-error" : undefined}
            aria-invalid={Boolean(state.errors.due_date?.length)}
            className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            name="due_date"
            type="date"
          />
          {state.errors.due_date?.length ? (
            <span className="mt-1 block text-xs text-red-700" id="task-due-date-error">
              {state.errors.due_date.join(" ")}
            </span>
          ) : null}
        </label>
      </div>
      {state.errors.projectId?.map((error) => (
        <p className="mt-4 text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
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
        {pending ? "Creating..." : "Add task"}
      </button>
    </form>
  );
}
