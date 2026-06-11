import { createEffect, createEvent, sample } from "effector"
import { signIn } from "next-auth/react"
import { loadSessionFx } from "@/entities/user"

export const loginFx = createEffect<
  { email: string; password: string },
  { ok: true } | { ok: false; error: string }
>(async ({ email, password }) => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  })
  if (result?.ok) {
    await loadSessionFx()
    return { ok: true as const }
  }
  return { ok: false as const, error: result?.error ?? "Неверный email или пароль" }
})

export const loginFormSubmitted = createEvent<{ email: string; password: string }>()

sample({
  clock: loginFormSubmitted,
  target: loginFx,
})
