import { createStore, createEvent, sample } from "effector"

export const $selectedTaskId = createStore<string | null>(null)
export const $taskDetailOpen = createStore<boolean>(false)

export const taskSelected = createEvent<string>()
export const taskDetailClosed = createEvent<void>()

sample({
  clock: taskSelected,
  fn: (id) => id,
  target: $selectedTaskId,
})

sample({
  clock: taskSelected,
  fn: () => true,
  target: $taskDetailOpen,
})

sample({
  clock: taskDetailClosed,
  fn: () => null,
  target: $selectedTaskId,
})

sample({
  clock: taskDetailClosed,
  fn: () => false,
  target: $taskDetailOpen,
})
