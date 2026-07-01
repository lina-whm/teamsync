"use client"

import { useState, useEffect } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { useUnit } from "effector-react"
import { useDragDropTask } from "@/features/drag-drop-task"
import { createTaskDialogOpened } from "@/features/create-task"
import { CreateTaskModal } from "@/features/create-task"
import { EditTaskModal, taskEditOpened } from "@/features/edit-task"
import { TaskDetailPanel } from "@/widgets/task-detail"
import { TaskFilters } from "@/features/filter-tasks"
import { KanbanColumn } from "./KanbanColumn"
import { getTasksQuery, Task, TaskStatus } from "@/entities/task"
import { boardMounted } from "../model/board.model"

const STATUSES: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"]

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
  const openCreate = useUnit(createTaskDialogOpened)
  const editTask = useUnit(taskEditOpened)

  useEffect(() => {
    onBoardMounted()
  }, [])

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Доска задач</h1>
        <button
          onClick={() => openCreate()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Новая задача
        </button>
      </div>
      <TaskFilters />
      {tasksPending && !tasks.length ? (
        <BoardSkeleton />
      ) : (
        <DndContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={groupedTasks[status]}
                onTaskClick={handleTaskClick}
              />
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
    </div>
  )
}
