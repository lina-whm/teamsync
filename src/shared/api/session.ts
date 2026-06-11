import { createEffect, createStore } from "effector"
import { getSession } from "next-auth/react"
import type { Session } from "next-auth"

export const loadSessionFx = createEffect(async (): Promise<Session | null> => {
  const session = await getSession()
  return session
})

export const $session = createStore<Session | null>(null).on(
  loadSessionFx.doneData,
  (_, session) => session,
)
