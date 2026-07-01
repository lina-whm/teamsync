import { createEvent, createStore, sample } from "effector"
import { updateTaskMutation, Task, UpdateTaskDto, refetchTasks } from "@/entities/task"

export const taskEditOpened = createEvent<Task>()
export const editTaskFormSubmitted = createEvent<{ id: string } & UpdateTaskDto>()
export const editTaskDialogClosed = createEvent()

export const $editingTask = createStore<Task | null>(null)
  .on(taskEditOpened, (_, task) => task)
  .reset(editTaskDialogClosed)

export const $editTaskDialogOpen = $editingTask.map((t) => t !== null)
export const $editTaskPending = updateTaskMutation.$pending

sample({
  clock: editTaskFormSubmitted,
  target: updateTaskMutation.start,
})

sample({
  clock: updateTaskMutation.finished.success,
  target: editTaskDialogClosed,
})

sample({
  clock: updateTaskMutation.finished.success,
  target: refetchTasks,
})
