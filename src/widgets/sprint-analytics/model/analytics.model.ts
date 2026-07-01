import { createEvent, sample } from "effector"
import { getTasksFx, getTasksQuery, refetchTasks, type Task } from "@/entities/task"
import { getSprintsQuery } from "@/entities/sprint"
import { $activeSprint } from "@/entities/sprint"

export const analyticsMounted = createEvent()

sample({
  clock: analyticsMounted,
  target: getSprintsQuery.start,
})

sample({
  clock: $activeSprint,
  filter: (sprint): sprint is NonNullable<typeof sprint> => sprint !== null,
  fn: (sprint) => ({
    sprintId: (sprint as NonNullable<typeof sprint>).id,
    filters: { status: "all" as const, search: "", priority: "all" as const, assigneeId: null },
  }),
  target: getTasksFx,
})

sample({
  clock: refetchTasks,
  source: $activeSprint,
  filter: (sprint): sprint is NonNullable<typeof sprint> => sprint !== null,
  fn: (sprint) => ({
    sprintId: (sprint as NonNullable<typeof sprint>).id,
    filters: { status: "all" as const, search: "", priority: "all" as const, assigneeId: null },
  }),
  target: getTasksFx,
})

sample({
  clock: getTasksFx.doneData,
  fn: (data) => data as Task[],
  target: getTasksQuery.__.lowLevelAPI.pushData,
})
