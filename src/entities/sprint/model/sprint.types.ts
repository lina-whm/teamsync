import { z } from "zod"

export const SprintStatus = z.enum(["PLANNING", "ACTIVE", "COMPLETED"])
export type SprintStatus = z.infer<typeof SprintStatus>

export const SprintSchema = z.object({
  id: z.string(),
  name: z.string(),
  goal: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  status: SprintStatus,
})

export type Sprint = z.infer<typeof SprintSchema>

export const CreateSprintSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  goal: z.string().max(500).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: SprintStatus.default("PLANNING"),
})

export type CreateSprintDto = z.infer<typeof CreateSprintSchema>
