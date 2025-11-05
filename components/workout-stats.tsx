"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Calendar, Dumbbell } from "lucide-react"

interface WorkoutStatsData {
  totalWorkouts: number
  last30Days: number
  averagePerWeek: number
}

export const WorkoutStats = () => {
  const [stats, setStats] = useState<WorkoutStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch workout count
        const countRes = await fetch("/api/hevy/workouts/count")
        const countData = await countRes.json()

        // Fetch recent workouts
        const workoutsRes = await fetch("/api/hevy/workouts?pageSize=30")
        const workoutsData = await workoutsRes.json()

        setStats({
          totalWorkouts: countData.workout_count,
          last30Days: workoutsData.workouts?.length || 0,
          averagePerWeek: ((workoutsData.workouts?.length || 0) / 30) * 7,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Workout Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              <span>Total Workouts</span>
            </div>
            <p className="text-3xl font-bold">{stats?.totalWorkouts || 0}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
            </div>
            <p className="text-3xl font-bold">{stats?.last30Days || 0}</p>
          </div>

          <div className="space-y-2">
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
  )
}
