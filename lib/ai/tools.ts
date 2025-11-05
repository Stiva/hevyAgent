// AI Agent Tools for Hevy Data Analysis
import { z } from "zod"
import { hevyClient } from "@/lib/hevy-client"
import { formatDistance, subDays, format } from "date-fns"

// Tool: Get Recent Workouts
export const getRecentWorkoutsTool = {
  description:
    "Get the user's recent workouts from Hevy. Use this to answer questions about recent training sessions, exercises performed, or workout frequency.",
  parameters: z.object({
    count: z
      .number()
      .min(1)
      .max(20)
      .default(5)
      .describe("Number of workouts to retrieve (1-20)"),
  }),
  execute: async ({ count }: { count: number }) => {
    const response = await hevyClient.getWorkouts(1, count)
    return {
      workouts: response.workouts.map((w) => ({
        id: w.id,
        title: w.title,
        date: format(new Date(w.start_time), "PPP"),
        duration: formatDistance(
          new Date(w.start_time),
          new Date(w.end_time)
        ),
        exercises: w.exercises.map((e) => ({
          name: e.title,
          sets: e.sets.length,
          totalReps: e.sets.reduce((sum, s) => sum + (s.reps || 0), 0),
          maxWeight: Math.max(...e.sets.map((s) => s.weight_kg || 0)),
        })),
      })),
    }
  },
}

// Tool: Get Workout Statistics
export const getWorkoutStatsTool = {
  description:
    "Get overall workout statistics including total count and workout frequency. Use this for high-level training insights.",
  parameters: z.object({}),
  execute: async () => {
    const countResponse = await hevyClient.getWorkoutsCount()
    const recentWorkouts = await hevyClient.getWorkouts(1, 30)

    return {
      totalWorkouts: countResponse.workout_count,
      last30Days: recentWorkouts.workouts.length,
      averagePerWeek: (recentWorkouts.workouts.length / 30) * 7,
    }
  },
}

// Tool: Get Exercise History
export const getExerciseHistoryTool = {
  description:
    "Get the history of a specific exercise showing progression over time. Use this to track strength gains or performance trends for a particular exercise.",
  parameters: z.object({
    exerciseTemplateId: z
      .string()
      .describe("The ID of the exercise template to get history for"),
    days: z
      .number()
      .min(7)
      .max(365)
      .default(30)
      .describe("Number of days of history to retrieve"),
  }),
  execute: async ({
    exerciseTemplateId,
    days,
  }: {
    exerciseTemplateId: string
    days: number
  }) => {
    const startDate = format(subDays(new Date(), days), "yyyy-MM-dd")
    const history = await hevyClient.getExerciseHistory(
      exerciseTemplateId,
      startDate
    )

    return {
      exercise: history.title,
      totalSessions: history.entries.length,
      progression: history.entries.map((entry) => ({
        date: entry.date,
        workout: entry.workout_title,
        maxWeight: Math.max(...entry.sets.map((s) => s.weight_kg || 0)),
        totalVolume: entry.sets.reduce(
          (sum, s) => sum + (s.weight_kg || 0) * (s.reps || 0),
          0
        ),
        sets: entry.sets.length,
      })),
    }
  },
}

// Tool: Get Available Routines
export const getRoutinesTool = {
  description:
    "Get the user's saved workout routines. Use this to help plan workouts or suggest routines to follow.",
  parameters: z.object({
    count: z
      .number()
      .min(1)
      .max(20)
      .default(10)
      .describe("Number of routines to retrieve"),
  }),
  execute: async ({ count }: { count: number }) => {
    const response = await hevyClient.getRoutines(1, count)
    return {
      routines: response.routines.map((r) => ({
        id: r.id,
        title: r.title,
        exercises: r.exercises.map((e) => ({
          name: e.title,
          sets: e.sets.length,
        })),
      })),
    }
  },
}

// Tool: Analyze Training Patterns
export const analyzeTrainingPatternsTool = {
  description:
    "Analyze the user's training patterns including muscle groups worked, workout frequency, and rest days. Use this for comprehensive training insights.",
  parameters: z.object({
    days: z
      .number()
      .min(7)
      .max(90)
      .default(30)
      .describe("Number of days to analyze"),
  }),
  execute: async ({ days }: { days: number }) => {
    const pageSize = Math.min(Math.ceil(days / 7) * 2, 30)
    const response = await hevyClient.getWorkouts(1, pageSize)

    const cutoffDate = subDays(new Date(), days)
    const workoutsInRange = response.workouts.filter(
      (w) => new Date(w.start_time) >= cutoffDate
    )

    // Calculate rest days
    const workoutDates = workoutsInRange
      .map((w) => format(new Date(w.start_time), "yyyy-MM-dd"))
      .sort()
    const uniqueDates = [...new Set(workoutDates)]

    // Count exercises
    const exerciseCounts: Record<string, number> = {}
    workoutsInRange.forEach((w) => {
      w.exercises.forEach((e) => {
        exerciseCounts[e.title] = (exerciseCounts[e.title] || 0) + 1
      })
    })

    const topExercises = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return {
      periodDays: days,
      totalWorkouts: workoutsInRange.length,
      activeDays: uniqueDates.length,
      restDays: days - uniqueDates.length,
      averageWorkoutsPerWeek: (workoutsInRange.length / days) * 7,
      topExercises,
      consistency: `${((uniqueDates.length / days) * 100).toFixed(1)}%`,
    }
  },
}

// Tool: Get Exercise Templates
export const getExerciseTemplatesTool = {
  description:
    "Get all available exercise templates from Hevy. Use this to help the user discover exercises or plan new routines.",
  parameters: z.object({}),
  execute: async () => {
    const response = await hevyClient.getExerciseTemplates()
    return {
      totalExercises: response.exercise_templates.length,
      exercises: response.exercise_templates.slice(0, 50).map((e) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        muscleGroup: e.muscle_group,
      })),
    }
  },
}

// Tool: Create Workout Routine
export const createRoutineTool = {
  description:
    "Create a new workout routine in Hevy. Use this when the user asks to create, design, or build a new training program or routine. The routine will include exercises with sets configuration.",
  parameters: z.object({
    title: z.string().describe("The name of the routine (e.g., 'Push Day', 'Upper Body A')"),
    exercises: z.array(
      z.object({
        exercise_template_id: z.string().describe("The ID of the exercise from the exercise templates"),
        rest_seconds: z.number().optional().describe("Rest time in seconds between sets (default: 90)"),
        notes: z.string().optional().describe("Optional notes for this exercise"),
        sets: z.array(
          z.object({
            type: z.enum(["normal", "warmup", "dropset", "failure"]).default("normal").describe("Type of set"),
            reps: z.number().optional().describe("Target reps for this set"),
            weight_kg: z.number().optional().describe("Target weight in kg for this set"),
            duration_seconds: z.number().optional().describe("Duration in seconds for timed exercises"),
            distance_meters: z.number().optional().describe("Distance in meters for distance-based exercises"),
          })
        ).min(1).describe("Array of sets for this exercise"),
      })
    ).min(1).describe("Array of exercises to include in the routine"),
    notes: z.string().optional().describe("Optional notes about the routine"),
    folder_id: z.number().optional().nullable().describe("Optional folder ID (number) to organize the routine"),
  }),
  execute: async ({ title, exercises, notes, folder_id }: {
    title: string
    exercises: Array<{
      exercise_template_id: string
      rest_seconds?: number
      notes?: string
      sets: Array<{
        type: "normal" | "warmup" | "dropset" | "failure"
        reps?: number
        weight_kg?: number
        duration_seconds?: number
        distance_meters?: number
      }>
    }>
    notes?: string
    folder_id?: number | null
  }) => {
    const routinePayload = {
      title,
      notes,
      folder_id: folder_id ?? null,
      exercises: exercises.map((ex) => ({
        exercise_template_id: ex.exercise_template_id,
        notes: ex.notes,
        superset_id: null,
        rest_seconds: ex.rest_seconds ?? 90,
        sets: ex.sets.map((set) => ({
          type: set.type,
          weight_kg: set.weight_kg ?? null,
          reps: set.reps ?? null,
          distance_meters: set.distance_meters ?? null,
          duration_seconds: set.duration_seconds ?? null,
          custom_metric: null,
          rep_range: set.reps ? { start: set.reps - 2, end: set.reps + 2 } : null,
        })),
      })),
    }

    console.log("🟢 === CREATE ROUTINE TOOL - TRANSFORMED PAYLOAD ===")
    console.log("🟢 Payload after transformation (before sending to hevy-client):")
    console.log(JSON.stringify(routinePayload, null, 2))
    console.log("🟢 === END TRANSFORMED PAYLOAD ===")

    const routine = await hevyClient.createRoutine(routinePayload)

    return {
      success: true,
      routine: {
        id: routine.id,
        title: routine.title,
        exercises: routine.exercises.map((e) => ({
          name: e.title,
          sets: e.sets.length,
          configuration: e.sets,
        })),
      },
      message: `Successfully created routine "${routine.title}" with ${routine.exercises.length} exercises`,
    }
  },
}

// Tool: Update Workout Routine
export const updateRoutineTool = {
  description:
    "Update an existing workout routine in Hevy. Use this when the user asks to modify, change, or update an existing routine. You can change the title, exercises, or sets configuration.",
  parameters: z.object({
    routine_id: z.string().describe("The ID of the routine to update"),
    title: z.string().optional().describe("New title for the routine"),
    exercises: z.array(
      z.object({
        exercise_template_id: z.string().describe("The ID of the exercise from the exercise templates"),
        rest_seconds: z.number().optional().describe("Rest time in seconds between sets (default: 90)"),
        notes: z.string().optional().describe("Optional notes for this exercise"),
        sets: z.array(
          z.object({
            type: z.enum(["normal", "warmup", "dropset", "failure"]).default("normal").describe("Type of set"),
            reps: z.number().optional().describe("Target reps for this set"),
            weight_kg: z.number().optional().describe("Target weight in kg for this set"),
            duration_seconds: z.number().optional().describe("Duration in seconds for timed exercises"),
            distance_meters: z.number().optional().describe("Distance in meters for distance-based exercises"),
          })
        ).min(1).describe("Array of sets for this exercise"),
      })
    ).optional().describe("New array of exercises (replaces existing)"),
    notes: z.string().optional().describe("New notes for the routine"),
  }),
  execute: async ({ routine_id, title, exercises, notes }: {
    routine_id: string
    title?: string
    exercises?: Array<{
      exercise_template_id: string
      rest_seconds?: number
      notes?: string
      sets: Array<{
        type: "normal" | "warmup" | "dropset" | "failure"
        reps?: number
        weight_kg?: number
        duration_seconds?: number
        distance_meters?: number
      }>
    }>
    notes?: string
  }) => {
    // Get existing routine first
    const existingRoutine = await hevyClient.getRoutine(routine_id)

    // Build update payload
    const updateData: any = {}
    if (title) updateData.title = title
    if (notes !== undefined) updateData.notes = notes
    if (exercises) {
      updateData.exercises = exercises.map((ex) => ({
        exercise_template_id: ex.exercise_template_id,
        notes: ex.notes ?? null,
        superset_id: null,
        rest_seconds: ex.rest_seconds ?? 90,
        sets: ex.sets.map((set) => ({
          type: set.type,
          weight_kg: set.weight_kg ?? null,
          reps: set.reps ?? null,
          distance_meters: set.distance_meters ?? null,
          duration_seconds: set.duration_seconds ?? null,
          custom_metric: null,
          rep_range: set.reps ? { start: set.reps - 2, end: set.reps + 2 } : null,
        })),
      }))
    }

    const updatedRoutine = await hevyClient.updateRoutine(routine_id, updateData)

    return {
      success: true,
      previousState: {
        title: existingRoutine.title,
        exercises: existingRoutine.exercises.length,
      },
      updatedRoutine: {
        id: updatedRoutine.id,
        title: updatedRoutine.title,
        exercises: updatedRoutine.exercises.map((e) => ({
          name: e.title,
          sets: e.sets.length,
          configuration: e.sets,
        })),
      },
      message: `Successfully updated routine "${updatedRoutine.title}"`,
    }
  },
}

// Export all tools
export const hevyTools = {
  get_recent_workouts: getRecentWorkoutsTool,
  get_workout_stats: getWorkoutStatsTool,
  get_exercise_history: getExerciseHistoryTool,
  get_routines: getRoutinesTool,
  analyze_training_patterns: analyzeTrainingPatternsTool,
  get_exercise_templates: getExerciseTemplatesTool,
  create_routine: createRoutineTool,
  update_routine: updateRoutineTool,
}
