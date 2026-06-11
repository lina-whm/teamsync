import { z } from "zod"

export const TaskStatus = z.enum(["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"])
export type TaskStatus = z.infer<typeof TaskStatus>

export const Priority = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
export type Priority = z.infer<typeof Priority>

const UserBriefSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
})

export type UserBrief = z.infer<typeof UserBriefSchema>

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  order: z.number(),
  status: TaskStatus,
  priority: Priority,
  storyPoints: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sprintId: z.string().nullable(),
  assigneeId: z.string().nullable(),
  creatorId: z.string().nullable(),
  assignee: UserBriefSchema.nullable(),
  creator: UserBriefSchema.nullable(),
})

export type Task = z.infer<typeof TaskSchema>

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  priority: Priority.default("MEDIUM"),
  assigneeId: z.string().optional(),
  storyPoints: z.number().int().min(1).max(100).default(1),
  sprintId: z.string().optional(),
})

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  status: TaskStatus.optional(),
})

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>

export const TaskFiltersSchema = z.object({
  status: z.union([TaskStatus, z.literal("all")]).default("all"),
  assigneeId: z.string().nullable().default(null),
  priority: z.union([Priority, z.literal("all")]).default("all"),
  search: z.string().default(""),
})

export type TaskFilters = z.infer<typeof TaskFiltersSchema>
