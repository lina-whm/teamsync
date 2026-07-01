import { createQuery } from "@farfetched/core"
import { createEffect, sample } from "effector"
import { z } from "zod"
import { apiClient } from "@/shared/api/base"
import { createContract } from "@/shared/api/contract"
import { UserSchema, type User } from "../model/user.types"

const usersArrayContract = createContract(z.array(UserSchema))

export const getUsersFx = createEffect(async () => {
  return apiClient<unknown>("/api/users")
})

export const getUsersQuery = createQuery({
  effect: getUsersFx,
  contract: usersArrayContract,
})

sample({
  clock: getUsersFx.doneData,
  fn: (data) => data as User[],
  target: getUsersQuery.__.lowLevelAPI.pushData,
})
