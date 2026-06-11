import { createQuery, createMutation } from "@farfetched/core"
import { createEffect } from "effector"
import { z } from "zod"
import { apiClient } from "@/shared/api/base"
import { createContract } from "@/shared/api/contract"
import {
  TaskSchema,
  CreateTaskSchema,
  TaskFiltersSchema,
  type CreateTaskDto,
  type UpdateTaskDto,
  type TaskFilters,
} from "../model/task.types"

const singleTaskContract = createContract(TaskSchema)
const tasksArrayContract = createContract(z.array(TaskSchema))

const getTasksFx = createEffect(
  async (params: { sprintId: string; filters?: TaskFilters }) => {
    const searchParams = new URLSearchParams()
    searchParams.set("sprintId", params.sprintId)

    const filters = TaskFiltersSchema.parse(params.filters ?? {})

    if (filters.status !== "all") {
      searchParams.set("status", filters.status)
    }
    if (filters.assigneeId) {
      searchParams.set("assigneeId", filters.assigneeId)
    }
    if (filters.priority !== "all") {
      searchParams.set("priority", filters.priority)
    }
    if (filters.search) {
      searchParams.set("search", filters.search)
    }

    return apiClient<unknown>(`/api/tasks?${searchParams.toString()}`)
  },
)

export const getTasksQuery = createQuery({
  effect: getTasksFx,
  contract: tasksArrayContract,
})

const getTaskByIdFx = createEffect(async (params: { id: string }) => {
  return apiClient<unknown>(`/api/tasks/${params.id}`)
})

export const getTaskByIdQuery = createQuery({
  effect: getTaskByIdFx,
  contract: singleTaskContract,
})

export const createTaskMutation = createMutation({
  handler: async (params: CreateTaskDto) => {
    const body = CreateTaskSchema.parse(params)
    return apiClient<unknown>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    })
  },
})

export const updateTaskMutation = createMutation({
  handler: async (params: { id: string } & Partial<UpdateTaskDto>) => {
    const { id, ...data } = params
    return apiClient<unknown>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
})

export const deleteTaskMutation = createMutation({
  handler: async (params: { id: string }) => {
    return apiClient<unknown>(`/api/tasks/${params.id}`, {
      method: "DELETE",
    })
  },
})
