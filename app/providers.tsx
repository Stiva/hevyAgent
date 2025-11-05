"use client"

import { SessionProvider } from "@/components/auth/session-provider"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

