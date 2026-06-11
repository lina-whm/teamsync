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

export function EditTaskModal() {
  const task = useUnit($editingTask)
  const open = useUnit($editTaskDialogOpen)
  const pending = useUnit($editTaskPending)
  const close = useUnit(editTaskDialogClosed)
  const submit = useUnit(editTaskFormSubmitted)

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
    submit({ id: task.id, ...data } as Parameters<typeof submit>[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => close()} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Редактировать задачу</h2>
          <button
            onClick={() => close()}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  )
}
