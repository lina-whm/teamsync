"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUnit } from "effector-react"
import { Loader2, X } from "lucide-react"
import {
  $editingTask,
  $editTaskDialogOpen,
  $editTaskPending,
  editTaskDialogClosed,
  editTaskFormSubmitted,
} from "@/features/edit-task/model/edit-task.model"
import { UpdateTaskSchema } from "@/entities/task"
import { getUsersQuery } from "@/entities/user"

export function EditTaskModal() {
  const task = useUnit($editingTask)
  const open = useUnit($editTaskDialogOpen)
  const pending = useUnit($editTaskPending)
  const close = useUnit(editTaskDialogClosed)
  const submit = useUnit(editTaskFormSubmitted)
  const users = useUnit(getUsersQuery.$data)

  useEffect(() => {
    getUsersQuery.start()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateTaskSchema),
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        status: task.status,
        assigneeId: task.assigneeId ?? "",
        storyPoints: task.storyPoints ?? undefined,
      })
    }
  }, [task, reset])

  if (!open || !task) return null

  const onSubmit = (data: Record<string, unknown>) => {
    const cleaned = { ...data }
    if (!cleaned.assigneeId) delete cleaned.assigneeId
    submit({ id: task.id, ...cleaned } as Parameters<typeof submit>[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.15s ease-out" }}
        onClick={() => close()}
      />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        style={{ animation: "scaleIn 0.2s ease-out" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Редактировать задачу</h2>
          <button
            onClick={() => close()}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="et-title">
              Название
            </label>
            <input
              id="et-title"
              {...register("title")}
              className="input-modern mt-1"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="et-description">
              Описание
            </label>
            <textarea
              id="et-description"
              rows={3}
              {...register("description")}
              className="input-modern mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="et-status">
                Статус
              </label>
              <select
                id="et-status"
                {...register("status")}
                className="input-modern mt-1"
              >
                <option value="BACKLOG">Новые</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="REVIEW">Ревью</option>
                <option value="DONE">Готово</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="et-priority">
                Приоритет
              </label>
              <select
                id="et-priority"
                {...register("priority")}
                className="input-modern mt-1"
              >
                <option value="LOW">Низкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="HIGH">Высокий</option>
                <option value="CRITICAL">Критический</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="et-storyPoints">
              Story Points
            </label>
            <input
              id="et-storyPoints"
              type="number"
              min={1}
              {...register("storyPoints", { valueAsNumber: true })}
              className="input-modern mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="et-assignee">
              Исполнитель
            </label>
            <select
              id="et-assignee"
              {...register("assigneeId")}
              className="input-modern mt-1"
            >
              <option value="">Не назначен</option>
              {users?.map((u: { id: string; name: string }) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  )
}
