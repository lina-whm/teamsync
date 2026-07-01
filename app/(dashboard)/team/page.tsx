"use client"

import { useUnit } from "effector-react"
import { useEffect, useState } from "react"
import { getUsersFx, getUsersQuery } from "@/entities/user"
import type { User } from "@/entities/user"
import { ProfileViewModal } from "@/features/profile-view"

export default function TeamPage() {
  const users = useUnit(getUsersQuery.$data)
  const pending = useUnit(getUsersQuery.$pending)
  const loadUsers = useUnit(getUsersFx)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  if (pending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Команда</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(users ?? []).map((user: User) => (
          <button
            key={user.id}
            type="button"
            onClick={() => setSelectedUser(user)}
            className="rounded-lg border bg-white p-4 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {initials(user.name)}
                </div>
              )}
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
          </button>
        ))}
      </div>

      {selectedUser && (
        <ProfileViewModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}
