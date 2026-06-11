"use client"

import { PropsWithChildren, useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "effector-react"
import { SessionProvider } from "next-auth/react"
import { queryClient } from "@/shared/config/query-client"
import { createIsomorphicScope } from "@/shared/lib/effector"
import { loadSessionFx } from "@/shared/api/session"

const scope = createIsomorphicScope()

export function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    loadSessionFx()
  }, [])

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Provider value={scope}>
          {children}
        </Provider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
