import { createStore, sample } from "effector"
import { debounce } from "patronum"
import { TaskFilters, Priority, TaskStatus } from "@/entities/task"
import { createFilterStore } from "@/shared/lib/factories"

import type { EventCallable, Store as StoreType } from "effector"

const filterStores = createFilterStore([
  { name: "search" },
  { name: "statusFilter" },
  { name: "priorityFilter" },
  { name: "assigneeFilter" },
])

export const $search = filterStores.$search as StoreType<string>
export const $statusFilter = filterStores.$statusFilter as StoreType<TaskStatus | "">
export const $priorityFilter = filterStores.$priorityFilter as StoreType<Priority | "">
export const $assigneeFilter = filterStores.$assigneeFilter as StoreType<string>

export const searchChanged = filterStores.searchChanged as EventCallable<string>
export const statusFilterChanged = filterStores.statusFilterChanged as EventCallable<TaskStatus | "">
export const priorityFilterChanged = filterStores.priorityFilterChanged as EventCallable<Priority | "">
export const assigneeFilterChanged = filterStores.assigneeFilterChanged as EventCallable<string>
export const filtersReset = filterStores.reset as EventCallable<void>

const debounceSearchChanged = debounce({
  source: searchChanged,
  timeout: 300,
})

export const $filters = createStore<TaskFilters>({
  search: "",
  status: "all",
  priority: "all",
  assigneeId: null,
}).reset(filtersReset)

sample({
  clock: [debounceSearchChanged, $statusFilter, $priorityFilter, $assigneeFilter],
  source: {
    search: $search,
    status: $statusFilter,
    priority: $priorityFilter,
    assigneeId: $assigneeFilter,
  },
  fn: ({ search, status, priority, assigneeId }): TaskFilters => ({
    search,
    status: (status || "all") as TaskStatus | "all",
    priority: (priority || "all") as Priority | "all",
    assigneeId: assigneeId || null,
  }),
  target: $filters,
})
