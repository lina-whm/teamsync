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
          <h2 className="text-lg font-semibold text-gray-900">Новая задача</h2>
          <button
            onClick={() => close()}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <CreateTaskForm />
      </div>
    </div>
  )
}
