"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useUnit } from "effector-react"
import { Loader2, X } from "lucide-react"
import {
  $profileDialogOpen,
  $savePending,
  profileEditClosed,
  profileFormSubmitted,
} from "../model/profile-edit.model"
import { $currentUser } from "@/entities/user"

export function ProfileEditModal() {
  const open = useUnit($profileDialogOpen)
  const pending = useUnit($savePending)
  const currentUser = useUnit($currentUser)
  const close = useUnit(profileEditClosed)
  const submit = useUnit(profileFormSubmitted)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (currentUser) {
      reset({ name: currentUser.name, avatar: currentUser.avatar ?? "" })
    }
  }, [currentUser, reset])

  if (!open) return null

  const onSubmit = (data: Record<string, unknown>) => {
    submit(data as { name: string; avatar: string })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => close()} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Редактировать профиль</h2>
          <button
            onClick={() => close()}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="pp-name">
              Имя
            </label>
            <input
              id="pp-name"
              {...register("name", { required: "Имя обязательно" })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="pp-avatar">
              URL аватара
            </label>
            <input
              id="pp-avatar"
              {...register("avatar")}
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
