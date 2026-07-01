"use client"

import { useEffect } from "react"
import { X, Mail, Briefcase, Building2, MapPin, Phone } from "lucide-react"
import type { User } from "@/entities/user"

interface Props {
  user: User
  onClose: () => void
}

export function ProfileViewModal({ user, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 ring-4 ring-gray-50">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            {user.position && (
              <p className="text-sm text-gray-500">{user.position}</p>
            )}
          </div>

          <span
            className={`inline-block rounded px-2.5 py-0.5 text-xs font-medium ${
              user.role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
          </span>
        </div>

        <div className="mt-5 space-y-3 border-t pt-4">
          {user.department && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{user.department}</span>
            </div>
          )}
          {user.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{user.city}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{user.email}</span>
          </div>
          {user.workEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{user.workEmail}</span>
            </div>
          )}
          {user.workPhone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{user.workPhone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
