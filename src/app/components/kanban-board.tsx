"use client";

import { useActionState, useOptimistic, useState, useTransition } from "react";
import { deleteTask, updateTaskStatus, type ActionState } from "@/app/actions";
import type { Task, TaskStatus } from "@/lib/queries";

const initialState: ActionState = { ok: true, errors: {} };

const columns: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "To do" },
  { status: "doing", title: "Doing" },
  { status: "done", title: "Done" },
];

const priorityClasses = {
  low: "bg-sky-50 text-sky-700",
  medium: "bg-amber-50 text-amber-800",
  high: "bg-rose-50 text-rose-700",
} as const;

const statusPosition: Record<TaskStatus, number> = {
  todo: 0,
  doing: 1,
  done: 2,
};

type OptimisticMove = {
  taskId: number;
  status: TaskStatus;
};

function applyMove(tasks: Task[], move: OptimisticMove): Task[] {
  return tasks.map((task) =>
    task.id === move.taskId ? { ...task, status: move.status } : task,
  );
}

export default function KanbanBoard({
  projectId,
  tasks,
  today,
}: {
  projectId: number;
  tasks: Task[];
  today: string;
}) {
  const [optimisticTasks, setOptimisticMove] = useOptimistic(
    tasks,
    applyMove,
  );
  const [isPending, startTransition] = useTransition();
  const [moveError, setMoveError] = useState<string | null>(null);

  function moveTask(taskId: number, status: TaskStatus) {
    setMoveError(null);
    startTransition(async () => {
      setOptimisticMove({ taskId, status });
      const formData = new FormData();
      formData.set("projectId", String(projectId));
      formData.set("taskId", String(taskId));
      formData.set("status", status);

      const result = await updateTaskStatus(initialState, formData);
      if (!result.ok) {
        setMoveError(
          result.errors.form?.[0] ??
            result.errors.status?.[0] ??
            "Could not move the task. Please try again.",
        );
      }
    });
  }

  return (
    <>
      {moveError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {moveError}
        </p>
      )}
      <div className="grid items-start gap-4 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = optimisticTasks.filter(
            (task) => task.status === column.status,
          );

          return (
            <section
              aria-labelledby={`column-${column.status}`}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-100/70 p-3 sm:p-4"
              key={column.status}
            >
              <header className="mb-3 flex items-center justify-between gap-3 px-1">
                <h2
                  className="font-semibold text-zinc-900"
                  id={`column-${column.status}`}
                >
                  {column.title}
                </h2>
                <span
                  aria-label={`${columnTasks.length} tasks`}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold tabular-nums text-zinc-600"
                >
                  {columnTasks.length}
                </span>
              </header>

              {columnTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white/70 px-4 py-8 text-center text-sm text-zinc-500">
                  No tasks in this column.
                </div>
              ) : (
                <ul className="space-y-3">
                  {columnTasks.map((task) => {
                    const position = statusPosition[task.status];
                    const overdue = task.due_date !== null && task.due_date < today;

                    return (
                      <li
                        className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-opacity ${isPending ? "opacity-80" : ""}`}
                        key={task.id}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-5 text-zinc-950">
                            {task.title}
                          </h3>
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${priorityClasses[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <div className="mt-3 min-h-5">
                          {task.due_date && (
                            <time
                              className={`text-xs font-medium ${overdue ? "text-red-700" : "text-zinc-500"}`}
                              dateTime={task.due_date}
                            >
                              {overdue ? "Overdue · " : "Due "}
                              {task.due_date}
                            </time>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
                          <div className="flex gap-2">
                            {position > 0 && (
                              <button
                                aria-label={`Move ${task.title} left`}
                                className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-50"
                                disabled={isPending}
                                onClick={() =>
                                  moveTask(
                                    task.id,
                                    columns[position - 1].status,
                                  )
                                }
                                type="button"
                              >
                                &larr; Move left
                              </button>
                            )}
                            {position < columns.length - 1 && (
                              <button
                                aria-label={`Move ${task.title} right`}
                                className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-50"
                                disabled={isPending}
                                onClick={() =>
                                  moveTask(
                                    task.id,
                                    columns[position + 1].status,
                                  )
                                }
                                type="button"
                              >
                                Move right &rarr;
                              </button>
                            )}
                          </div>
                          <DeleteTaskForm projectId={projectId} task={task} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

function DeleteTaskForm({
  projectId,
  task,
}: {
  projectId: number;
  task: Task;
}) {
  const [state, formAction, pending] = useActionState(deleteTask, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input name="projectId" type="hidden" value={projectId} />
      <input name="taskId" type="hidden" value={task.id} />
      <button
        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
        disabled={pending}
        type="submit"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {(state.errors.form?.[0] ||
        state.errors.projectId?.[0] ||
        state.errors.taskId?.[0]) && (
        <span className="mt-2 block text-xs text-red-700" role="alert">
          {state.errors.form?.[0] ??
            state.errors.projectId?.[0] ??
            state.errors.taskId?.[0]}
        </span>
      )}
    </form>
  );
}
