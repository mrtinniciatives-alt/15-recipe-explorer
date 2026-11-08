import { z } from "zod";
import { sql } from "@/lib/db";
import { TaskPrioritySchema, TaskStatusSchema } from "@/lib/validation";

const projectSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  created_at: z.string(),
  task_count: z.number(),
  done_count: z.number(),
});

const taskFiltersSchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueBefore: z.iso.date().optional(),
}).strict();

const taskSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  title: z.string(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  due_date: z.string().nullable(),
  created_at: z.string(),
});

export type ProjectSummary = z.infer<typeof projectSummarySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
export type Task = z.infer<typeof taskSchema>;

export async function getProjects(): Promise<ProjectSummary[]> {
  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.description,
      p.color,
      p.created_at::text AS created_at,
      COUNT(t.id)::int AS task_count,
      COUNT(t.id) FILTER (WHERE t.status = 'done')::int AS done_count
    FROM projects AS p
    LEFT JOIN tasks AS t ON t.project_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC, p.id DESC
  `;

  return projectSummarySchema.array().parse(rows);
}

export async function getProject(id: number): Promise<ProjectSummary | null> {
  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.description,
      p.color,
      p.created_at::text AS created_at,
      COUNT(t.id)::int AS task_count,
      COUNT(t.id) FILTER (WHERE t.status = 'done')::int AS done_count
    FROM projects AS p
    LEFT JOIN tasks AS t ON t.project_id = p.id
    WHERE p.id = ${id}
    GROUP BY p.id
    LIMIT 1
  `;

  return projectSummarySchema.array().parse(rows)[0] ?? null;
}

export async function getTasks(
  projectId: number,
  filters: TaskFilters = {},
): Promise<Task[]> {
  const validatedFilters = taskFiltersSchema.parse(filters);
  const rows = await sql`
    SELECT
      t.id,
      t.project_id,
      t.title,
      t.status,
      t.priority,
      t.due_date::text AS due_date,
      t.created_at::text AS created_at
    FROM tasks AS t
    WHERE t.project_id = ${projectId}
      AND (${validatedFilters.status ?? null}::text IS NULL
        OR t.status = ${validatedFilters.status ?? null})
      AND (${validatedFilters.priority ?? null}::text IS NULL
        OR t.priority = ${validatedFilters.priority ?? null})
      AND (${validatedFilters.dueBefore ?? null}::date IS NULL
        OR t.due_date <= ${validatedFilters.dueBefore ?? null})
    ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC
  `;

  return taskSchema.array().parse(rows);
}
