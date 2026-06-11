"use client"

import { useDraggable } from "@dnd-kit/core"
import { Task, Priority, TaskStatus } from "@/entities/task"

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  CRITICAL: "Критический",
}

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  BACKLOG: "border-l-gray-300",
  IN_PROGRESS: "border-l-blue-500",
  REVIEW: "border-l-yellow-500",
  DONE: "border-l-green-500",
}

interface KanbanCardProps {
  task: Task
  onClick: () => void
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 50,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={onClick}
      className={`cursor-grab rounded-md border border-l-4 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        STATUS_COLORS[task.status]
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <p className="mb-2 text-sm font-medium text-gray-900">{task.title}</p>
      <div className="flex items-center gap-2">
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
            PRIORITY_COLORS[task.priority]
          }`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.storyPoints && (
          <span className="text-xs text-gray-500">{task.storyPoints} SP</span>
        )}
      </div>
      {task.assignee && (
        <p className="mt-1 text-xs text-gray-500">{task.assignee.name}</p>
      )}
    </div>
  )
}
