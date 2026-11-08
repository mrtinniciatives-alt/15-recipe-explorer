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
  q: z.string().trim().max(120).optional(),
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

const countByStatusSchema = z.object({
  status: TaskStatusSchema,
  count: z.number(),
});

const countByPrioritySchema = z.object({
  priority: TaskPrioritySchema,
  count: z.number(),
});

const projectCompletionSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  task_count: z.number(),
  done_count: z.number(),
  completion_percent: z.number(),
});

const overdueTaskSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  project_name: z.string(),
  title: z.string(),
  due_date: z.string(),
  priority: TaskPrioritySchema,
});

const dashboardStatsSchema = z.object({
  project_count: z.number(),
  task_count: z.number(),
  done_count: z.number(),
  overdue_count: z.number(),
  status_counts: countByStatusSchema.array(),
  priority_counts: countByPrioritySchema.array(),
  project_completion: projectCompletionSchema.array(),
  overdue_tasks: overdueTaskSchema.array(),
});

export type ProjectSummary = z.infer<typeof projectSummarySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
export type Task = z.infer<typeof taskSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

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
      AND (${validatedFilters.q ?? null}::text IS NULL
        OR strpos(lower(t.title), lower(${validatedFilters.q ?? null})) > 0)
    ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC
  `;

  return taskSchema.array().parse(rows);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const rows = await sql`
    WITH status_counts AS (
      SELECT status, COUNT(*)::int AS task_count
      FROM tasks
      GROUP BY status
    ),
    priority_counts AS (
      SELECT priority, COUNT(*)::int AS task_count
      FROM tasks
      GROUP BY priority
    ),
    project_completion AS (
      SELECT
        p.id,
        p.name,
        p.color,
        COUNT(t.id)::int AS task_count,
        COUNT(t.id) FILTER (WHERE t.status = 'done')::int AS done_count,
        CASE
          WHEN COUNT(t.id) = 0 THEN 0
          ELSE ROUND(
            COUNT(t.id) FILTER (WHERE t.status = 'done') * 100.0 / COUNT(t.id)
          )::int
        END AS completion_percent
      FROM projects AS p
      LEFT JOIN tasks AS t ON t.project_id = p.id
      GROUP BY p.id
    ),
    overdue_tasks AS (
      SELECT
        t.id,
        t.project_id,
        p.name AS project_name,
        t.title,
        t.due_date::text AS due_date,
        t.priority
      FROM tasks AS t
      INNER JOIN projects AS p ON p.id = t.project_id
      WHERE t.due_date < CURRENT_DATE
        AND t.status <> 'done'
    )
    SELECT
      (SELECT COUNT(*)::int FROM projects) AS project_count,
      (SELECT COUNT(*)::int FROM tasks) AS task_count,
      (SELECT COUNT(*) FILTER (WHERE status = 'done')::int FROM tasks) AS done_count,
      (SELECT COUNT(*)::int FROM overdue_tasks) AS overdue_count,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object('status', status, 'count', task_count)
            ORDER BY CASE status
              WHEN 'todo' THEN 1
              WHEN 'doing' THEN 2
              ELSE 3
            END
          )
          FROM status_counts
        ),
        '[]'::json
      ) AS status_counts,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object('priority', priority, 'count', task_count)
            ORDER BY CASE priority
              WHEN 'low' THEN 1
              WHEN 'medium' THEN 2
              ELSE 3
            END
          )
          FROM priority_counts
        ),
        '[]'::json
      ) AS priority_counts,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', id,
              'name', name,
              'color', color,
              'task_count', task_count,
              'done_count', done_count,
              'completion_percent', completion_percent
            )
            ORDER BY name
          )
          FROM project_completion
        ),
        '[]'::json
      ) AS project_completion,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', id,
              'project_id', project_id,
              'project_name', project_name,
              'title', title,
              'due_date', due_date,
              'priority', priority
            )
            ORDER BY due_date, title
          )
          FROM overdue_tasks
        ),
        '[]'::json
      ) AS overdue_tasks
  `;

  return dashboardStatsSchema.parse(rows[0]);
}
