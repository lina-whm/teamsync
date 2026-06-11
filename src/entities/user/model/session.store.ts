import { createStore, createEffect } from "effector"
import { getSession } from "next-auth/react"
import { getInitials } from "@/shared/lib/utils"
import type { User, Role } from "./user.types"

export const $currentUser = createStore<User | null>(null)
export const $isAuthenticated = $currentUser.map(Boolean)

export const $userName = $currentUser.map((u) => u?.name ?? "Гость")
export const $userInitials = $currentUser.map((u) =>
  u ? getInitials(u.name) : "?",
)

export const loadSessionFx = createEffect(async (): Promise<User | null> => {
  const session = await getSession()
  if (!session?.user) return null

  const { user } = session as { user: { id: string; email: string; name: string; role?: string; image?: string } }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: (user.role ?? "MEMBER") as Role,
    avatar: user.image,
  }
})

$currentUser.on(loadSessionFx.doneData, (_, user) => user)
