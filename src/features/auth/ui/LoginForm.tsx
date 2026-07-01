"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUnit } from "effector-react"
import { Loader2 } from "lucide-react"
import { loginFormSubmitted, loginFx } from "@/features/auth/model/auth.model"

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = useUnit(loginFormSubmitted)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setPending(true)
    setError(null)
    submit(data)
    try {
      const result = await loginFx(data)
      if (!result.ok) {
        setError(result.error)
      } else {
        router.push("/board")
      }
    } catch {
      setError("Произошла ошибка при входе")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-xl font-bold text-white shadow-lg shadow-blue-200">
            TS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TeamSync</h1>
          <p className="mt-1 text-sm text-gray-500">Войдите в систему</p>
        </div>
        <div className="rounded-2xl border bg-white p-8 shadow-lg shadow-gray-200/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@teamsync.dev"
                {...register("email")}
                className="input-modern mt-1.5"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                placeholder="password123"
                {...register("password")}
                className="input-modern mt-1.5"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
            {error && (
              <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          Demo: admin@teamsync.dev / password123
        </p>
      </div>
    </div>
  )
}
