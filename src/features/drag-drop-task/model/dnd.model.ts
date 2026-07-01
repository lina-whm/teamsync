"use client"

import { useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { useUnit } from "effector-react"
import { apiClient } from "@/shared/api/base"
import { TaskStatus, refetchTasks } from "@/entities/task"

export function useDragDropTask() {
  const refetch = useUnit(refetchTasks)

  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
    }: {
      taskId: string
      newStatus: TaskStatus
    }) => {
      await apiClient(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
    },
    onSuccess: () => {
      refetch()
    },
  })

  const handleDragEnd = useCallback(
    (activeId: string, overId: string | null) => {
      if (!overId || activeId === overId) return

      const statusMap: Record<string, TaskStatus> = {
        backlog: "BACKLOG",
        "in-progress": "IN_PROGRESS",
        review: "REVIEW",
        done: "DONE",
      }

      const newStatus = statusMap[overId]
      if (!newStatus) return

      mutation.mutate({ taskId: activeId, newStatus })
    },
    [mutation],
  )

  return { handleDragEnd, isPending: mutation.isPending }
}
