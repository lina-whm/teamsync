import type { Contract } from "@farfetched/core"
import { z } from "zod"

export function createContract<T>(schema: z.ZodType<T>): Contract<unknown, T> {
  return {
    isData: (data: unknown): data is T => schema.safeParse(data).success,
    getErrorMessages: (data: unknown): string[] => {
      const result = schema.safeParse(data)
      return result.success ? [] : result.error.issues.map((i) => i.message)
    },
  }
}
