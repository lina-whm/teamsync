"use client"

import { useDraggable } from "@dnd-kit/core"
import { Pencil, Trash2 } from "lucide-react"
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
  onEdit: () => void
  onDelete: () => void
}

export function KanbanCard({ task, onClick, onEdit, onDelete }: KanbanCardProps) {
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
      className={`group relative rounded-md border border-l-4 bg-white shadow-sm ${
        STATUS_COLORS[task.status]
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <div
        onClick={onClick}
        className="cursor-pointer p-3 transition-shadow hover:shadow-md"
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
      <div className="absolute right-1 top-1 hidden gap-0.5 group-hover:flex">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onEdit() }}
          className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
          title="Редактировать"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
          title="Удалить"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
