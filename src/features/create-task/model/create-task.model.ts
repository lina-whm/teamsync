import { createEvent, createStore, sample } from "effector"
import { createTaskMutation, CreateTaskDto, refetchTasks } from "@/entities/task"

export const createTaskFormSubmitted = createEvent<CreateTaskDto>()
export const createTaskDialogOpened = createEvent()
export const createTaskDialogClosed = createEvent()
export const $createTaskDialogOpen = createStore(false)
  .on(createTaskDialogOpened, () => true)
  .on(createTaskDialogClosed, () => false)

export const $createTaskPending = createTaskMutation.$pending

sample({
  clock: createTaskFormSubmitted,
  target: createTaskMutation.start,
})

sample({
  clock: createTaskMutation.finished.success,
  target: createTaskDialogClosed,
})

sample({
  clock: createTaskMutation.finished.success,
  target: refetchTasks,
})
