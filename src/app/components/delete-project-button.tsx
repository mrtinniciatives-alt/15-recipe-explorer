"use client";

import { useActionState } from "react";
import { deleteProject, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: true, errors: {} };

export default function DeleteProjectButton({
  projectId,
}: {
  projectId: number;
}) {
  const [state, formAction, pending] = useActionState(
    deleteProject,
    initialState,
  );

  return (
    <form action={formAction}>
      <input name="projectId" type="hidden" value={projectId} />
      {state.errors.projectId?.map((error) => (
        <p className="mb-2 text-sm text-red-700" key={error} role="alert">
          {error}
        </p>
      ))}
      <button
        className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Deleting..." : "Delete project"}
      </button>
    </form>
  );
}
