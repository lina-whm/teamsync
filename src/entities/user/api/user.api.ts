import { createQuery } from "@farfetched/core"
import { createEffect } from "effector"
import { z } from "zod"
import { apiClient } from "@/shared/api/base"
import { createContract } from "@/shared/api/contract"
import { UserSchema } from "../model/user.types"

const usersArrayContract = createContract(z.array(UserSchema))

const getUsersFx = createEffect(async () => {
  return apiClient<unknown>("/api/users")
})

export const getUsersQuery = createQuery({
  effect: getUsersFx,
  contract: usersArrayContract,
})
