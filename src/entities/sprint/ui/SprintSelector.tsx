"use client"

import { useUnit } from "effector-react"
import { $activeSprint, $sprints, $sprintsPending, sprintChanged } from "../model/sprint.store"
import type { Sprint } from "../model/sprint.types"

export function SprintSelector() {
  const activeSprint = useUnit($activeSprint)
  const sprints = useUnit($sprints)
  const pending = useUnit($sprintsPending)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = sprints.find((s) => s.id === e.target.value)
    if (selected) {
      sprintChanged(selected)
    }
  }

  if (pending) {
    return (
      <div className="h-9 w-48 animate-pulse rounded-md bg-gray-200" />
    )
  }

  return (
    <select
      value={activeSprint?.id ?? ""}
      onChange={handleChange}
      className="block w-48 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {sprints.map((sprint: Sprint) => (
        <option key={sprint.id} value={sprint.id}>
          {sprint.name}
        </option>
      ))}
    </select>
  )
}
