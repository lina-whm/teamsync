import { createEvent, createStore, sample } from "effector"
import { debounce } from "patronum"
import { TaskFilters, Priority, TaskStatus } from "@/entities/task"
import { $activeSprint } from "@/entities/sprint"

export const searchChanged = createEvent<string>()
export const statusFilterChanged = createEvent<TaskStatus | "">()
export const priorityFilterChanged = createEvent<Priority | "">()
export const assigneeFilterChanged = createEvent<string>()
export const filtersReset = createEvent()

export const $search = createStore("")
  .on(searchChanged, (_, v) => v)
  .reset(filtersReset)

export const $statusFilter = createStore<TaskStatus | "">("")
  .on(statusFilterChanged, (_, v) => v)
  .reset(filtersReset)

export const $priorityFilter = createStore<Priority | "">("")
  .on(priorityFilterChanged, (_, v) => v)
  .reset(filtersReset)

export const $assigneeFilter = createStore<string>("")
  .on(assigneeFilterChanged, (_, v) => v)
  .reset(filtersReset)

const $debouncedSearch = createStore("")
const debounceSearchChanged = debounce({
  source: searchChanged,
  timeout: 300,
})

sample({
  clock: debounceSearchChanged,
  target: $debouncedSearch,
})

export const $filters = createStore<TaskFilters>({
  search: "",
  status: "all",
  priority: "all",
  assigneeId: null,
}).reset(filtersReset)

sample({
  clock: [$debouncedSearch, $statusFilter, $priorityFilter, $assigneeFilter],
  source: {
    search: $debouncedSearch,
    status: $statusFilter,
    priority: $priorityFilter,
    assigneeId: $assigneeFilter,
  },
  fn: ({ search, status, priority, assigneeId }): TaskFilters => ({
    search: search,
    status: (status || "all") as TaskStatus | "all",
    priority: (priority || "all") as Priority | "all",
    assigneeId: assigneeId || null,
  }),
  target: $filters,
})
