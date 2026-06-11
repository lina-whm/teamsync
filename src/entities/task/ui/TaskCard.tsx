"use client"

import { cn, formatDate } from "@/shared/lib/utils"
import { TaskBadge } from "./TaskBadge"
import type { Task } from "../model/task.types"

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-all",
        "hover:border-blue-300 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-600">
          {task.storyPoints}
        </span>
      </div>

      <div className="mt-2">
        <TaskBadge status={task.status} priority={task.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-medium text-blue-700">
              {task.assignee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
          <span>{task.assignee?.name ?? ""}</span>
        </div>
        <time>{formatDate(task.createdAt)}</time>
      </div>
    </button>
  )
}
