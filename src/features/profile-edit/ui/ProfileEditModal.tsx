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

interface FormFields {
  firstName: string
  lastName: string
  position: string
  department: string
  city: string
  workEmail: string
  workPhone: string
}

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
  } = useForm<FormFields>()

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName ?? currentUser.name,
        lastName: currentUser.lastName ?? "",
        position: currentUser.position ?? "",
        department: currentUser.department ?? "",
        city: currentUser.city ?? "",
        workEmail: currentUser.workEmail ?? "",
        workPhone: currentUser.workPhone ?? "",
      })
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

  const onSubmit = async (data: FormFields) => {
    if (!currentUser) return
    const file = fileRef.current?.files?.[0]
    let avatar: string | null

    if (file) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("avatar", file)
        const res = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        })
        avatar = res.ok ? (await res.json()).url : null
      } catch {
        avatar = null
      }
      setUploading(false)
    } else {
      avatar = null
    }

    if (!avatar && !removeAvatar) {
      avatar = currentUser?.avatar ?? null
    }

    const toNull = (v: string) => (v.trim() === "" ? null : v.trim())

    submit({
      userId: currentUser!.id,
      firstName: data.firstName.trim(),
      lastName: toNull(data.lastName),
      position: toNull(data.position),
      department: toNull(data.department),
      city: toNull(data.city),
      workEmail: toNull(data.workEmail),
      workPhone: toNull(data.workPhone),
      avatar,
    })
  }

  const displaySrc = preview ?? (removeAvatar ? null : currentUser?.avatar) ?? null

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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Редактировать профиль</h2>
          <button
            onClick={() => close()}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {displaySrc ? (
                <div className="relative">
                  <img
                    src={displaySrc}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null)
                      setRemoveAvatar(true)
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-transform hover:scale-110"
                    title="Удалить аватар"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-50">
                  <Upload className="h-7 w-7 text-gray-400" />
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
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

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="pp-firstName">Имя</label>
              <input id="pp-firstName" {...register("firstName", { required: "Имя обязательно" })} className="input-modern mt-1" />
              {errors.firstName && <p className="mt-0.5 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="pp-lastName">Фамилия</label>
              <input id="pp-lastName" {...register("lastName")} className="input-modern mt-1" />
            </div>
          </div>

          {/* Position & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="pp-position">Должность</label>
              <input id="pp-position" {...register("position")} className="input-modern mt-1" placeholder="Frontend Developer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="pp-department">Отдел</label>
              <input id="pp-department" {...register("department")} className="input-modern mt-1" placeholder="Engineering" />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium text-gray-700" htmlFor="pp-city">Город</label>
            <input id="pp-city" {...register("city")} className="input-modern mt-1" placeholder="Moscow" />
          </div>

          {/* Work contacts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="pp-workEmail">Рабочая почта</label>
              <input id="pp-workEmail" {...register("workEmail")} className="input-modern mt-1" placeholder="user@company.ru" type="email" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700" htmlFor="pp-workPhone">Рабочий телефон</label>
              <input id="pp-workPhone" {...register("workPhone")} className="input-modern mt-1" placeholder="+7-999-111-22-33" type="tel" />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending || uploading}
            className="btn-primary mt-2 w-full"
          >
            {(pending || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? "Загрузка..." : pending ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  )
}
