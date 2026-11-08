"use client";

import { useActionState } from "react";
import {
  deleteTask,
  updateTaskStatus,
  type ActionState,
} from "@/app/actions";
import type { Task, TaskStatus } from "@/lib/queries";

const initialState: ActionState = { ok: true, errors: {} };

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  doing: "In progress",
  done: "Done",
};

export default function TaskActions({
  projectId,
  task,
}: {
  projectId: number;
  task: Task;
}) {
  const [statusState, statusAction, statusPending] = useActionState(
    updateTaskStatus,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteTask,
    initialState,
  );

  return (
    <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-zinc-100 pt-4">
      <form action={statusAction} className="flex flex-wrap items-end gap-2">
        <input name="projectId" type="hidden" value={projectId} />
        <input name="taskId" type="hidden" value={task.id} />
        <label className="text-xs font-medium text-zinc-600">
          Status
          <select
            className="mt-1 block rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            defaultValue={task.status}
            name="status"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
          disabled={statusPending}
          type="submit"
        >
          {statusPending ? "Saving..." : "Update"}
        </button>
      </form>
      <form action={deleteAction}>
        <input name="projectId" type="hidden" value={projectId} />
        <input name="taskId" type="hidden" value={task.id} />
        <button
          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          disabled={deletePending}
          type="submit"
        >
          {deletePending ? "Deleting..." : "Delete task"}
        </button>
      </form>
      {statusState.errors.form?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {statusState.errors.status?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {statusState.errors.projectId?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {statusState.errors.taskId?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {statusState.message && (
        <p className="basis-full text-sm text-emerald-700" role="status">
          {statusState.message}
        </p>
      )}
      {deleteState.errors.form?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {deleteState.errors.projectId?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      {deleteState.errors.taskId?.map((error) => (
        <p className="basis-full text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
    </div>
  );
}
