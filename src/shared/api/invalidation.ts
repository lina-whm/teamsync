import { createEffect } from "effector"
import { queryClient } from "@/shared/config/query-client"

export const invalidateTasksCacheFx = createEffect(async () => {
  await queryClient.invalidateQueries({ queryKey: ["tasks"] })
})

export const invalidateSprintsCacheFx = createEffect(async () => {
  await queryClient.invalidateQueries({ queryKey: ["sprints"] })
})
