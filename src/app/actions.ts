"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { IdInput, ProjectInput, TaskInput, TaskStatusSchema } from "@/lib/validation";
import { sql } from "@/lib/db";

export type ActionState = {
  ok: boolean;
  errors: Partial<Record<string, string[]>>;
  message?: string;
};

function invalidInput(error: z.ZodError): ActionState {
  return { ok: false, errors: error.flatten().fieldErrors };
}

function mutationFailure(field: string, message: string): ActionState {
  return { ok: false, errors: { [field]: [message] } };
}

function mutationSuccess(message: string): ActionState {
  return { ok: true, errors: {}, message };
}

const taskFormSchema = z.object({
  projectId: IdInput,
  title: TaskInput.shape.title,
  status: TaskInput.shape.status,
  priority: TaskInput.shape.priority,
  due_date: TaskInput.shape.due_date,
});

const updateTaskSchema = z.object({
  projectId: IdInput,
  taskId: IdInput,
  status: TaskStatusSchema,
});

const deleteTaskSchema = z.object({
  projectId: IdInput,
  taskId: IdInput,
});

const deleteProjectSchema = z.object({
  projectId: IdInput,
});

export async function createProject(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = ProjectInput.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    color: formData.get("color") ?? "#6366f1",
  });

  if (!parsed.success) {
    return invalidInput(parsed.error);
  }

  await sql`
    INSERT INTO projects (name, description, color)
    VALUES (${parsed.data.name}, ${parsed.data.description}, ${parsed.data.color})
  `;

  revalidatePath("/");
  return mutationSuccess("Project created.");
}

export async function createTask(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = taskFormSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    due_date: formData.get("due_date") ?? "",
  });

  if (!parsed.success) {
    return invalidInput(parsed.error);
  }

  const inserted = await sql`
    INSERT INTO tasks (project_id, title, status, priority, due_date)
    SELECT p.id, ${parsed.data.title}, ${parsed.data.status},
      ${parsed.data.priority}, ${parsed.data.due_date ?? null}
    FROM projects AS p
    WHERE p.id = ${parsed.data.projectId}
    RETURNING id
  `;

  if (inserted.length === 0) {
    return mutationFailure("projectId", "That project no longer exists.");
  }

  revalidatePath("/");
  revalidatePath(`/projects/${parsed.data.projectId}`);
  return mutationSuccess("Task created.");
}

export async function updateTaskStatus(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updateTaskSchema.safeParse({
    projectId: formData.get("projectId"),
    taskId: formData.get("taskId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error);
  }

  const updated = await sql`
    UPDATE tasks
    SET status = ${parsed.data.status}
    WHERE id = ${parsed.data.taskId}
      AND project_id = ${parsed.data.projectId}
    RETURNING id
  `;

  if (updated.length === 0) {
    return mutationFailure("form", "Task not found in this project.");
  }

  revalidatePath("/");
  revalidatePath(`/projects/${parsed.data.projectId}`);
  return mutationSuccess("Task status updated.");
}

export async function deleteTask(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteTaskSchema.safeParse({
    projectId: formData.get("projectId"),
    taskId: formData.get("taskId"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error);
  }

  const deleted = await sql`
    DELETE FROM tasks
    WHERE id = ${parsed.data.taskId}
      AND project_id = ${parsed.data.projectId}
    RETURNING id
  `;

  if (deleted.length === 0) {
    return mutationFailure("form", "Task not found in this project.");
  }

  revalidatePath("/");
  revalidatePath(`/projects/${parsed.data.projectId}`);
  return mutationSuccess("Task deleted.");
}

export async function deleteProject(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteProjectSchema.safeParse({
    projectId: formData.get("projectId"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error);
  }

  const deleted = await sql`
    DELETE FROM projects
    WHERE id = ${parsed.data.projectId}
    RETURNING id
  `;

  if (deleted.length === 0) {
    return mutationFailure("projectId", "Project not found.");
  }

  revalidatePath("/");
  revalidatePath(`/projects/${parsed.data.projectId}`);
  redirect("/");
}
