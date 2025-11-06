"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Calendar, Dumbbell, AlertCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { WorkoutsListModal } from "@/components/workouts-list-modal"

interface WorkoutStatsData {
  totalWorkouts: number
  last30Days: number
  averagePerWeek: number
}

interface ErrorState {
  type: "API_KEY_NOT_CONFIGURED" | "INVALID_API_KEY" | "UNAUTHORIZED" | "INTERNAL_ERROR" | "NETWORK_ERROR"
  message: string
}

export const WorkoutStats = () => {
  const [stats, setStats] = useState<WorkoutStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorState | null>(null)
  const [selectedView, setSelectedView] = useState<"total" | "last30" | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null)

        // Fetch workout count
        const countRes = await fetch("/api/hevy/workouts/count")

        if (!countRes.ok) {
          const errorData = await countRes.json().catch(() => ({
            message: "Failed to fetch workout count",
            errorType: "INTERNAL_ERROR",
          }))

          setError({
            type: errorData.errorType || "INTERNAL_ERROR",
            message: errorData.message || "Failed to connect to Hevy API",
          })
          return
        }

        const countData = await countRes.json()

        // Fetch recent workouts
        const workoutsRes = await fetch("/api/hevy/workouts?pageSize=30")

        if (!workoutsRes.ok) {
          const errorData = await workoutsRes.json().catch(() => ({
            message: "Failed to fetch workouts",
            errorType: "INTERNAL_ERROR",
          }))

          setError({
            type: errorData.errorType || "INTERNAL_ERROR",
            message: errorData.message || "Failed to connect to Hevy API",
          })
          return
        }

        const workoutsData = await workoutsRes.json()

        setStats({
          totalWorkouts: countData.workout_count,
          last30Days: workoutsData.workouts?.length || 0,
          averagePerWeek: ((workoutsData.workouts?.length || 0) / 30) * 7,
        })
      } catch (error) {
        console.error("❌ Failed to fetch workout stats:", error)
        setError({
          type: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error occurred",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-600">{error.message}</p>

            {error.type === "API_KEY_NOT_CONFIGURED" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  To view your workout statistics, you need to configure your Hevy API key.
                </p>
                <Link href="/settings">
                  <Button className="w-full gap-2">
                    <Settings className="w-4 h-4" />
                    Configure API Key in Settings
                  </Button>
                </Link>
              </div>
            )}

            {error.type === "INVALID_API_KEY" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  Your Hevy API key appears to be invalid or expired. Please update it in settings.
                </p>
                <Link href="/settings">
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="w-4 h-4" />
                    Update API Key
                  </Button>
                </Link>
              </div>
            )}

            {error.type === "UNAUTHORIZED" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  Your session has expired. Please sign in again.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = "/sign-in"}
                >
                  Sign In
                </Button>
              </div>
            )}

            {(error.type === "INTERNAL_ERROR" || error.type === "NETWORK_ERROR") && (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  An unexpected error occurred. Please try refreshing the page or check your internet connection.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <WorkoutsListModal
        isOpen={selectedView !== null}
        onClose={() => setSelectedView(null)}
        view={selectedView || "total"}
      />

      <div className="space-y-4">
        <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Workout Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => setSelectedView("total")}
            className="w-full text-left space-y-2 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              <span>Total Workouts</span>
            </div>
            <p className="text-3xl font-bold">{stats?.totalWorkouts || 0}</p>
            <p className="text-xs text-slate-500">Click to view all workouts</p>
          </button>

          <button
            onClick={() => setSelectedView("last30")}
            className="w-full text-left space-y-2 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
            </div>
            <p className="text-3xl font-bold">{stats?.last30Days || 0}</p>
            <p className="text-xs text-slate-500">Click to view recent workouts</p>
          </button>

          <div className="space-y-2 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Average Per Week</span>
            </div>
            <p className="text-3xl font-bold">
              {stats?.averagePerWeek.toFixed(1) || 0}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Quick Tips</h3>
          <ul className="text-sm space-y-2 text-slate-700">
            <li>• Ask about specific exercises to see progression</li>
            <li>• Request workout recommendations</li>
            <li>• Analyze your training patterns</li>
            <li>• Get insights on rest and recovery</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
