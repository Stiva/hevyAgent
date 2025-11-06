"use client"

import { ChatInterface } from "@/components/chat-interface"
import { WorkoutStats } from "@/components/workout-stats"
import { UserMenu } from "@/components/auth/user-menu"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Dumbbell } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Hevy Training Assistant</h1>
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <WorkoutStats />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
