"use client"

import { PropsWithChildren, useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "effector-react"
import { SessionProvider } from "next-auth/react"
import { queryClient } from "@/shared/config/query-client"
import { createIsomorphicScope } from "@/shared/lib/effector"
import { loadSessionFx } from "@/entities/user"

const scope = createIsomorphicScope()

export function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    loadSessionFx()
  }, [])

  return (
    <SessionProvider refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <Provider value={scope}>
          {children}
        </Provider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
