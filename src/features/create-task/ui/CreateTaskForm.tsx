"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUnit } from "effector-react"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { createTaskFormSubmitted, $createTaskPending } from "@/features/create-task/model/create-task.model"
import { CreateTaskSchema } from "@/entities/task"
import { getUsersQuery } from "@/entities/user"
import { $activeSprint } from "@/entities/sprint"

export function CreateTaskForm() {
  const submit = useUnit(createTaskFormSubmitted)
  const pending = useUnit($createTaskPending)
  const activeSprint = useUnit($activeSprint)
  const users = useUnit(getUsersQuery.$data)
  const usersLoading = useUnit(getUsersQuery.$pending)

  useEffect(() => {
    getUsersQuery.start()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      sprintId: activeSprint?.id ?? "",
    },
  })

  const onSubmit = (data: Record<string, unknown>) => {
    submit(data as Parameters<typeof submit>[0])
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="ct-title">
          Название
        </label>
        <input
          id="ct-title"
          {...register("title")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="ct-description">
          Описание
        </label>
        <textarea
          id="ct-description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="ct-priority">
            Приоритет
          </label>
          <select
            id="ct-priority"
            {...register("priority")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="LOW">Низкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HIGH">Высокий</option>
            <option value="CRITICAL">Критический</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="ct-storyPoints">
            Story Points
          </label>
          <input
            id="ct-storyPoints"
            type="number"
            min={1}
            {...register("storyPoints", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="ct-assignee">
          Исполнитель
        </label>
        <select
          id="ct-assignee"
          {...register("assigneeId")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {pending ? "Создание..." : "Создать задачу"}
      </button>
    </form>
  )
}
