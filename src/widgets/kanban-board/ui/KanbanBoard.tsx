"use client"

import { useState, useEffect } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { useUnit } from "effector-react"
import { useDragDropTask } from "@/features/drag-drop-task"
import { $filters } from "@/features/filter-tasks"
import { $createTaskDialogOpen, createTaskDialogOpened } from "@/features/create-task"
import { TaskFilters } from "@/features/filter-tasks"
import { CreateTaskModal } from "@/features/create-task"
import { EditTaskModal, taskEditOpened } from "@/features/edit-task"
import { TaskDetailPanel } from "@/widgets/task-detail"
import { KanbanColumn } from "./KanbanColumn"
import { getTasksQuery, Task, TaskStatus } from "@/entities/task"

const STATUSES: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"]

export function KanbanBoard() {
  const filters = useUnit($filters)
  const tasksData = useUnit(getTasksQuery.$data)
  const tasksPending = useUnit(getTasksQuery.$pending)
  const { handleDragEnd } = useDragDropTask()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const openCreate = useUnit(createTaskDialogOpened)
  const editTask = useUnit(taskEditOpened)

  useEffect(() => {
    getTasksQuery.start({ sprintId: "", filters })
  }, [filters])

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
      {tasksPending ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
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
