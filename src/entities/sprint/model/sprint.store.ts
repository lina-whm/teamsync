import { createStore, createEvent, sample } from "effector"
import { getSprintsQuery } from "../api/sprint.api"
import type { Sprint } from "./sprint.types"

export const $activeSprint = createStore<Sprint | null>(null)
export const $sprints = createStore<Sprint[]>([])

export const sprintChanged = createEvent<Sprint>()
export const sprintsLoaded = createEvent<Sprint[]>()

export const $sprintsPending = getSprintsQuery.$pending

sample({
  clock: sprintChanged,
  target: $activeSprint,
})

sample({
  clock: getSprintsQuery.finished.success,
  fn: ({ result }) => result,
  target: $sprints,
})

sample({
  clock: $sprints,
  filter: (sprints) => sprints.length > 0,
  fn: (sprints) => {
    return sprints.find((s) => s.status === "ACTIVE") ?? sprints[0]
  },
  target: $activeSprint,
})
