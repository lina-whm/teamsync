"use client"

import { useDroppable } from "@dnd-kit/core"
import { Task, TaskStatus } from "@/entities/task"
import { KanbanCard } from "./KanbanCard"

const COLUMN_TITLES: Record<TaskStatus, string> = {
  BACKLOG: "Новые",
  IN_PROGRESS: "В работе",
  REVIEW: "Ревью",
  DONE: "Готово",
}

const STATUS_IDS: Record<TaskStatus, string> = {
  BACKLOG: "backlog",
  IN_PROGRESS: "in-progress",
  REVIEW: "review",
  DONE: "done",
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskEdit: (task: Task) => void
  onTaskDelete: (task: Task) => void
  onViewProfile?: (userId: string) => void
}

export function KanbanColumn({ status, tasks, onTaskClick, onTaskEdit, onTaskDelete, onViewProfile }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: STATUS_IDS[status],
  })

  return (
    <div
      ref={setNodeRef}
      data-testid={`column-${status}`}
      className={`flex min-h-[400px] w-full flex-col rounded-lg bg-gray-100 p-3 ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{COLUMN_TITLES[status]}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} onEdit={() => onTaskEdit(task)} onDelete={() => onTaskDelete(task)} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  )
}
