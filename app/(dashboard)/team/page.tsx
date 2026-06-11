"use client"

import { useUnit } from "effector-react"
import { useEffect } from "react"
import { getUsersQuery } from "@/entities/user"

export default function TeamPage() {
  const users = useUnit(getUsersQuery.$data)
  const pending = useUnit(getUsersQuery.$pending)

  useEffect(() => {
    getUsersQuery.start()
  }, [])

  if (pending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Команда</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(users ?? []).map((user: { id: string; name: string; email: string; role: string }) => (
          <div key={user.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                  user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
