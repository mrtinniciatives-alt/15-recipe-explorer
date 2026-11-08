import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "doing", "done"]);
export const TaskPrioritySchema = z.enum(["low", "medium", "high"]);

export const ProjectInput = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(2000).optional().default(""),
  color: z.string().regex(/^#[\da-fA-F]{6}$/).optional().default("#6366f1"),
});

export const TaskInput = z.object({
  title: z.string().trim().min(2).max(140),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  due_date: z
    .union([z.literal(""), z.iso.date()])
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

export const IdInput = z
  .string()
  .regex(/^[1-9]\d*$/, "Choose a valid item.")
  .transform(Number)
  .pipe(z.number().int().positive().safe());
