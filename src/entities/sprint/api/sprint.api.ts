import { createQuery, createMutation } from "@farfetched/core"
import { createEffect } from "effector"
import { z } from "zod"
import { apiClient } from "@/shared/api/base"
import { createContract } from "@/shared/api/contract"
import {
  SprintSchema,
  CreateSprintSchema,
  type CreateSprintDto,
} from "../model/sprint.types"

const singleSprintContract = createContract(SprintSchema)
const sprintsArrayContract = createContract(z.array(SprintSchema))

const getSprintsFx = createEffect(async () => {
  return apiClient<unknown>("/api/sprints")
})

export const getSprintsQuery = createQuery({
  effect: getSprintsFx,
  contract: sprintsArrayContract,
})

export const createSprintMutation = createMutation({
  handler: async (params: CreateSprintDto) => {
    const body = CreateSprintSchema.parse(params)
    return apiClient<unknown>("/api/sprints", {
      method: "POST",
      body: JSON.stringify(body),
    })
  },
})
