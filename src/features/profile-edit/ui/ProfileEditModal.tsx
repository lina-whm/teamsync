"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useUnit } from "effector-react"
import { Loader2, Trash2, Upload, X } from "lucide-react"
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
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (currentUser) {
      reset({ name: currentUser.name })
      setPreview(null)
      setRemoveAvatar(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }, [currentUser, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, close])

  if (!open) return null

  const onSubmit = async (data: Record<string, unknown>) => {
    const file = fileRef.current?.files?.[0]
    let avatarUrl: string | null

    if (file) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("avatar", file)
        const res = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        })
        avatarUrl = res.ok ? (await res.json()).url : null
      } catch {
        avatarUrl = null
      }
      setUploading(false)
    } else {
      avatarUrl = null
    }

    if (!avatarUrl && !removeAvatar) {
      avatarUrl = currentUser?.avatar ?? null
    }

    submit({ name: data.name as string, avatarUrl })
  }

  const displaySrc = preview ?? (removeAvatar ? null : currentUser?.avatar) ?? null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => close()} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Редактировать профиль</h2>
          <button
            onClick={() => close()}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {displaySrc ? (
                <div className="relative">
                  <img
                    src={displaySrc}
                    alt=""
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null)
                      setRemoveAvatar(true)
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                    title="Удалить аватар"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-50">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors">
              {displaySrc ? "Изменить фото" : "Загрузить фото"}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setPreview(URL.createObjectURL(f))
                    setRemoveAvatar(false)
                  }
                }}
              />
            </label>
          </div>
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
          <button
            type="submit"
            disabled={pending || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {(pending || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? "Загрузка..." : pending ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  )
}
