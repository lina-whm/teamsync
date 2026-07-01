"use client"

import { useUnit } from "effector-react"
import { useMutation } from "@tanstack/react-query"
import { X, Pencil, Trash2, Loader2 } from "lucide-react"
import { Task, Priority, TaskStatus, refetchTasks } from "@/entities/task"
import { apiClient } from "@/shared/api/base"

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  CRITICAL: "Критический",
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
}

interface TaskDetailPanelProps {
  task: Task | null
  open: boolean
  onClose: () => void
  onEdit: () => void
}

export function TaskDetailPanel({ task, open, onClose, onEdit }: TaskDetailPanelProps) {
  const refetch = useUnit(refetchTasks)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!task) return
      await apiClient(`/api/tasks/${task.id}`, { method: "DELETE" })
    },
    onSuccess: () => {
      refetch()
      onClose()
    },
  })

  if (!open || !task) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.15s ease-out" }}
        onClick={onClose}
      />
      <div
        className="relative z-50 w-full max-w-md bg-white p-6 shadow-2xl"
        style={{ animation: "slideIn 0.2s ease-out" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-gray-500">Статус</span>
            <p className="text-sm text-gray-900">{STATUS_LABELS[task.status]}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">Приоритет</span>
            <p className="text-sm text-gray-900">{PRIORITY_LABELS[task.priority]}</p>
          </div>
          {task.storyPoints && (
            <div>
              <span className="text-xs font-medium text-gray-500">Story Points</span>
              <p className="text-sm text-gray-900">{task.storyPoints}</p>
            </div>
          )}
          <div>
            <span className="text-xs font-medium text-gray-500">Автор</span>
            <p className="text-sm text-gray-900">{task.creator?.name ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">Исполнитель</span>
            <p className="text-sm text-gray-900">{task.assignee?.name ?? "Не назначен"}</p>
          </div>
          {task.description && (
            <div>
              <span className="text-xs font-medium text-gray-500">Описание</span>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}
          <div>
            <span className="text-xs font-medium text-gray-500">Создана</span>
            <p className="text-sm text-gray-900">
              {new Date(task.createdAt).toLocaleDateString("ru-RU")}
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3 border-t pt-4">
          <button onClick={onEdit} className="btn-primary">
            <Pencil className="h-4 w-4" />
            Редактировать
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="btn-destructive"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
