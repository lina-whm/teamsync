"use client"

import { useUnit } from "effector-react"
import { X } from "lucide-react"
import { $createTaskDialogOpen, createTaskDialogClosed } from "@/features/create-task/model/create-task.model"
import { CreateTaskForm } from "@/features/create-task/ui/CreateTaskForm"

export function CreateTaskModal() {
  const open = useUnit($createTaskDialogOpen)
  const close = useUnit(createTaskDialogClosed)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => close()} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Новая задача</h2>
          <button
            onClick={() => close()}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <CreateTaskForm />
      </div>
    </div>
  )
}
