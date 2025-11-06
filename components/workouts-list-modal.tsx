"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar, Clock, Dumbbell, Loader2 } from "lucide-react"
import { HevyWorkout } from "@/types/hevy"

interface WorkoutsListModalProps {
  isOpen: boolean
  onClose: () => void
  view: "total" | "last30"
}

export const WorkoutsListModal = ({ isOpen, onClose, view }: WorkoutsListModalProps) => {
  const [workouts, setWorkouts] = useState<HevyWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch workouts based on view
        const pageSize = view === "last30" ? 30 : 100
        const response = await fetch(`/api/hevy/workouts?pageSize=${pageSize}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: "Failed to fetch workouts",
          }))
          setError(errorData.message)
          return
        }

        const data = await response.json()
        setWorkouts(data.workouts || [])
      } catch (err) {
        console.error("Failed to fetch workouts:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [isOpen, view])

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end.getTime() - start.getTime()
    const minutes = Math.floor(durationMs / 60000)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl">
            {view === "total" ? "All Workouts" : "Last 30 Days Workouts"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto flex-1 p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {!loading && !error && workouts.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No workouts found</p>
            </div>
          )}

          {!loading && !error && workouts.length > 0 && (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <Card key={workout.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-lg">
                          {workout.title || "Untitled Workout"}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(workout.start_time)}</span>
                          </div>
                          {workout.start_time && workout.end_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{calculateDuration(workout.start_time, workout.end_time)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Dumbbell className="w-4 h-4" />
                            <span>{workout.exercises?.length || 0} exercises</span>
                          </div>
                        </div>
                        {workout.description && (
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {workout.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
