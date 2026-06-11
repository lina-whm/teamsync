"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUnit } from "effector-react"
import { useEffect } from "react"
import { LayoutDashboard, BarChart3, Users, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { $currentUser, $userInitials } from "@/entities/user"
import { $activeSprint, sprintChanged, getSprintsQuery } from "@/entities/sprint"

const NAV_ITEMS = [
  { href: "/board", label: "Доска", icon: LayoutDashboard },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/team", label: "Команда", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const currentUser = useUnit($currentUser)
  const initials = useUnit($userInitials)
  const activeSprint = useUnit($activeSprint)
  const changeSprint = useUnit(sprintChanged)
  const sprints = useUnit(getSprintsQuery.$data)
  const sprintsPending = useUnit(getSprintsQuery.$pending)

  useEffect(() => {
    getSprintsQuery.start()
  }, [])

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
          TS
        </div>
        <span className="text-lg font-bold text-gray-900">TeamSync</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
        <div className="border-t pt-4 mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1 px-3">
            Спринт
          </label>
          <select
            value={activeSprint?.id ?? ""}
            onChange={(e) => {
              const sprint = sprints?.find((s: { id: string }) => s.id === e.target.value)
              if (sprint) changeSprint(sprint)
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {(sprints ?? []).map((sprint: { id: string; name: string; status: string }) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name} ({sprint.status === "ACTIVE" ? "активен" : "завершён"})
              </option>
            ))}
          </select>
        </div>
      </nav>
      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {currentUser?.name ?? "Пользователь"}
            </p>
            <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="rounded p-1 text-gray-400 hover:text-gray-600"
            title="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
