import { z } from "zod"

export const Role = z.enum(["ADMIN", "MEMBER"])
export type Role = z.infer<typeof Role>

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  role: Role,
})

export type User = z.infer<typeof UserSchema>
