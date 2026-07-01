import { createEvent, sample, combine } from "effector"
import { getTasksFx, getTasksQuery, refetchTasks, type Task } from "@/entities/task"
import { $filters } from "@/features/filter-tasks"
import { $activeSprint, getSprintsQuery } from "@/entities/sprint"

export const boardMounted = createEvent()

const $tasksParams = combine({
  sprintId: $activeSprint.map((s) => s?.id ?? ""),
  filters: $filters,
})

sample({
  clock: boardMounted,
  target: getSprintsQuery.start,
})

sample({
  clock: $activeSprint,
  filter: (sprint): sprint is NonNullable<typeof sprint> => sprint !== null,
  source: $filters,
  fn: (filters, sprint) => ({
    sprintId: (sprint as NonNullable<typeof sprint>).id,
    filters,
  }),
  target: getTasksFx,
})

sample({
  clock: [$tasksParams, refetchTasks],
  source: $tasksParams,
  filter: (params) => params.sprintId !== "",
  target: getTasksFx,
})

sample({
  clock: getTasksFx.doneData,
  fn: (data) => data as Task[],
  target: getTasksQuery.__.lowLevelAPI.pushData,
})
