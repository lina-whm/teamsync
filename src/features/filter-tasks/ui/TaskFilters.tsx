"use client"

import { useUnit } from "effector-react"
import { useEffect } from "react"
import { RotateCcw } from "lucide-react"
import {
  $search,
  $statusFilter,
  $priorityFilter,
  $assigneeFilter,
  searchChanged,
  statusFilterChanged,
  priorityFilterChanged,
  assigneeFilterChanged,
  filtersReset,
} from "@/features/filter-tasks/model/filters.model"
import { getUsersQuery } from "@/entities/user"

export function TaskFilters() {
  const search = useUnit($search)
  const status = useUnit($statusFilter)
  const priority = useUnit($priorityFilter)
  const assignee = useUnit($assigneeFilter)
  const users = useUnit(getUsersQuery.$data)
  const onChangeSearch = useUnit(searchChanged)
  const onChangeStatus = useUnit(statusFilterChanged)
  const onChangePriority = useUnit(priorityFilterChanged)
  const onChangeAssignee = useUnit(assigneeFilterChanged)
  const onReset = useUnit(filtersReset)

  useEffect(() => {
    getUsersQuery.start()
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Поиск задач..."
        value={search}
        onChange={(e) => onChangeSearch(e.target.value)}
        className="min-w-[200px] rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <select
        value={status}
        onChange={(e) => onChangeStatus(e.target.value as typeof status)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Все статусы</option>
        <option value="BACKLOG">Новые</option>
        <option value="IN_PROGRESS">В работе</option>
        <option value="REVIEW">Ревью</option>
        <option value="DONE">Готово</option>
      </select>
      <select
        value={priority}
        onChange={(e) => onChangePriority(e.target.value as typeof priority)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Все приоритеты</option>
        <option value="LOW">Низкий</option>
        <option value="MEDIUM">Средний</option>
        <option value="HIGH">Высокий</option>
        <option value="CRITICAL">Критический</option>
      </select>
      <select
        value={assignee}
        onChange={(e) => onChangeAssignee(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Все исполнители</option>
        {users?.map((u: { id: string; name: string }) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => onReset()}
        className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        <RotateCcw className="h-4 w-4" />
        Сброс
      </button>
    </div>
  )
}
