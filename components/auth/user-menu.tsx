"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { Settings } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/settings"
        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Settings</span>
      </Link>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
          },
        }}
      />
    </div>
  )
}
