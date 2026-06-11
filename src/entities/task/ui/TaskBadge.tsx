"use client"

import { cn } from "@/shared/lib/utils"
import type { TaskStatus, Priority } from "../model/task.types"

const statusStyles: Record<TaskStatus, string> = {
  BACKLOG: "bg-gray-100 text-gray-700 border-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-200",
  DONE: "bg-green-100 text-green-700 border-green-200",
}

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-gray-100 text-gray-600 border-gray-200",
  MEDIUM: "bg-blue-100 text-blue-600 border-blue-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
}

const statusLabels: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
}

const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
}

interface StatusBadgeProps {
  status?: TaskStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

interface PriorityBadgeProps {
  priority?: Priority
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority) return null

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        priorityStyles[priority],
      )}
    >
      {priorityLabels[priority]}
    </span>
  )
}

interface TaskBadgeProps {
  status?: TaskStatus
  priority?: Priority
}

export function TaskBadge({ status, priority }: TaskBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      {status && <StatusBadge status={status} />}
      {priority && <PriorityBadge priority={priority} />}
    </div>
  )
}
