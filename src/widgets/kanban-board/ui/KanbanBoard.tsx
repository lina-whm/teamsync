"use client"

import { useState, useEffect } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { useUnit } from "effector-react"
import { reflect } from "@/shared/lib/reflect"
import { useDragDropTask } from "@/features/drag-drop-task"
import { createTaskDialogOpened } from "@/features/create-task"
import { CreateTaskModal } from "@/features/create-task"
import { EditTaskModal, taskEditOpened } from "@/features/edit-task"
import { TaskDetailPanel } from "@/widgets/task-detail"
import { TaskFilters } from "@/features/filter-tasks"
import { ProfileViewModal } from "@/features/profile-view"
import { KanbanColumn } from "./KanbanColumn"
import { getTasksQuery, Task, TaskStatus, refetchTasks } from "@/entities/task"
import { getUsersQuery, getUsersFx } from "@/entities/user"
import type { User } from "@/entities/user"
import { apiClient } from "@/shared/api/base"
import { boardMounted } from "../model/board.model"

const STATUSES: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"]

const CreateTaskButton = reflect({
  view: ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      + Новая задача
    </button>
  ),
  bind: { onClick: createTaskDialogOpened },
})

const TaskCounter = reflect({
  view: ({ count }: { count: number }) => (
    <span className="text-sm text-gray-500">{count} задач</span>
  ),
  bind: {
    count: getTasksQuery.$data.map((tasks) => (tasks ?? []).length),
  },
})

function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {STATUSES.map((s) => (
        <div key={s} className="min-h-[400px] rounded-lg bg-gray-100 p-3 animate-pulse">
          <div className="mb-3 h-5 w-20 rounded bg-gray-200" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-2 h-24 rounded-md bg-white/60" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function KanbanBoard() {
  const tasksData = useUnit(getTasksQuery.$data)
  const tasksPending = useUnit(getTasksQuery.$pending)
  const onBoardMounted = useUnit(boardMounted)
  const { handleDragEnd } = useDragDropTask()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const editTask = useUnit(taskEditOpened)
  const refetch = useUnit(refetchTasks)
  const loadUsers = useUnit(getUsersFx)

  useEffect(() => {
    onBoardMounted()
    loadUsers()
  }, [])

  const users = useUnit(getUsersQuery.$data)
  const [viewProfileUser, setViewProfileUser] = useState<User | null>(null)

  const tasks: Task[] = tasksData ?? []

  const groupedTasks = STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t: Task) => t.status === status)
      return acc
    },
    {} as Record<TaskStatus, Task[]>,
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    handleDragEnd(String(active.id), String(over.id))
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDetailOpen(true)
  }

  const handleEditTask = () => {
    if (selectedTask) {
      editTask(selectedTask)
      setDetailOpen(false)
    }
  }

  const handleCardEdit = (task: Task) => {
    editTask(task)
  }

  const handleViewProfile = (userId: string) => {
    const user = (users ?? []).find((u: User) => u.id === userId)
    if (user) setViewProfileUser(user)
  }

  const handleCardDelete = async (task: Task) => {
    try {
      await apiClient(`/api/tasks/${task.id}`, { method: "DELETE" })
      refetch()
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Доска задач</h1>
        <div className="flex items-center gap-3">
          <TaskCounter />
          <CreateTaskButton />
        </div>
      </div>
      <TaskFilters />
      {tasksPending && !tasks.length ? (
        <BoardSkeleton />
      ) : (
        <DndContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {STATUSES.map((status) => (
              <div key={status} className="min-w-[280px] snap-start lg:min-w-0">
                <KanbanColumn
                  status={status}
                  tasks={groupedTasks[status]}
                  onTaskClick={handleTaskClick}
                  onTaskEdit={handleCardEdit}
                  onTaskDelete={handleCardDelete}
                  onViewProfile={handleViewProfile}
                />
              </div>
            ))}
          </div>
        </DndContext>
      )}
      <CreateTaskModal />
      <EditTaskModal />
      <TaskDetailPanel
        task={selectedTask}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEditTask}
      />
      {viewProfileUser && (
        <ProfileViewModal
          user={viewProfileUser}
          onClose={() => setViewProfileUser(null)}
        />
      )}
    </div>
  )
}
