import { z } from "zod"

export const Role = z.enum(["ADMIN", "MEMBER"])
export type Role = z.infer<typeof Role>

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  workEmail: z.string().nullable().optional(),
  workPhone: z.string().nullable().optional(),
  role: Role,
})

export type User = z.infer<typeof UserSchema>
