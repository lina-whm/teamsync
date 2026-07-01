"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUnit } from "effector-react"
import { useEffect } from "react"
import { LayoutDashboard, BarChart3, Users, LogOut, X } from "lucide-react"
import { signOut } from "next-auth/react"
import { $currentUser, $userInitials } from "@/entities/user"
import { profileEditOpened, ProfileEditModal } from "@/features/profile-edit"
import { $activeSprint, sprintChanged, getSprintsQuery } from "@/entities/sprint"

const NAV_ITEMS = [
  { href: "/board", label: "Доска", icon: LayoutDashboard },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/team", label: "Команда", icon: Users },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function AppSidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const currentUser = useUnit($currentUser)
  const initials = useUnit($userInitials)
  const activeSprint = useUnit($activeSprint)
  const changeSprint = useUnit(sprintChanged)
  const sprints = useUnit(getSprintsQuery.$data)
  const openProfileEdit = useUnit(profileEditOpened)

  useEffect(() => {
    getSprintsQuery.start()
  }, [])

  const nav = (
    <>
      <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-sm">
            TS
          </div>
          <span className="text-lg font-bold text-gray-900">TeamSync</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              {item.label}
            </Link>
          )
        })}
        <div className="border-t pt-4 mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1.5 px-3">
            Спринт
          </label>
          <select
            value={activeSprint?.id ?? ""}
            onChange={(e) => {
              const sprint = sprints?.find((s: { id: string }) => s.id === e.target.value)
              if (sprint) changeSprint(sprint)
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
          <button
            onClick={() => { openProfileEdit(); onClose() }}
            className="flex items-center gap-3 flex-1 min-w-0 rounded-lg p-1.5 hover:bg-gray-50 transition-colors text-left"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-sm">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {currentUser?.name ?? "Пользователь"}
              </p>
              <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
            </div>
          </button>
          <button
            onClick={() => signOut()}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0"
            title="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
        {nav}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r bg-white shadow-2xl"
            style={{ animation: "slideIn 0.2s ease-out" }}
          >
            {nav}
          </aside>
        </div>
      )}

      <ProfileEditModal />
    </>
  )
}
