// Hevy API Client
// Handles all communication with the Hevy API

import {
  HevyWorkout,
  HevyWorkoutsResponse,
  HevyWorkoutsCountResponse,
  HevyRoutine,
  HevyRoutinesResponse,
  HevyRoutineFolder,
  HevyRoutineFoldersResponse,
  HevyExerciseTemplate,
  HevyExerciseTemplatesResponse,
  HevyExerciseHistory,
  CreateWorkoutRequest,
  CreateRoutineRequest,
  CreateRoutineFolderRequest,
  HevyWorkoutEventsResponse,
  HevyApiError,
} from "@/types/hevy"

export class HevyClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error("Hevy API key is required")
    }
    this.apiKey = apiKey
    this.baseUrl = baseUrl || process.env.HEVY_API_BASE_URL || "https://api.hevyapp.com"
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "api-key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error: HevyApiError = await response.json().catch(() => ({
        error: "Unknown Error",
        message: response.statusText,
        status_code: response.status,
      }))
      throw new Error(`Hevy API Error: ${error.message}`)
    }

    return response.json()
  }

  // Workouts
  async getWorkouts(page = 1, pageSize = 10): Promise<HevyWorkoutsResponse> {
    return this.request<HevyWorkoutsResponse>(
      `/v1/workouts?page=${page}&pageSize=${pageSize}`
    )
  }

  async getWorkout(workoutId: string): Promise<HevyWorkout> {
    return this.request<HevyWorkout>(`/v1/workouts/${workoutId}`)
  }

  async getWorkoutsCount(): Promise<HevyWorkoutsCountResponse> {
    return this.request<HevyWorkoutsCountResponse>("/v1/workouts/count")
  }

  async createWorkout(workout: CreateWorkoutRequest): Promise<HevyWorkout> {
    return this.request<HevyWorkout>("/v1/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
    })
  }

  async getWorkoutEvents(
    sinceDate: string,
    page = 1,
    pageSize = 10
  ): Promise<HevyWorkoutEventsResponse> {
    return this.request<HevyWorkoutEventsResponse>(
      `/v1/workout_events?since=${sinceDate}&page=${page}&pageSize=${pageSize}`
    )
  }

  // Routines
  async getRoutines(page = 1, pageSize = 10): Promise<HevyRoutinesResponse> {
    return this.request<HevyRoutinesResponse>(
      `/v1/routines?page=${page}&pageSize=${pageSize}`
    )
  }

  async getRoutine(routineId: string): Promise<HevyRoutine> {
    return this.request<HevyRoutine>(`/v1/routines/${routineId}`)
  }

  async createRoutine(routine: CreateRoutineRequest): Promise<HevyRoutine> {
    const payload = { routine }
    console.log("🔵 === HEVY API CREATE ROUTINE PAYLOAD ===")
    console.log("🔵 Full payload being sent to Hevy API:")
    console.log(JSON.stringify(payload, null, 2))
    console.log("🔵 === END PAYLOAD ===")

    const response = await this.request<{ routine: HevyRoutine[] }>("/v1/routines", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    console.log("🔵 === HEVY API RESPONSE ===")
    console.log("🔵 Response from Hevy API:")
    console.log(JSON.stringify(response, null, 2))
    console.log("🔵 === END RESPONSE ===")

    // Hevy API returns { routine: [routineObject] }, so unwrap the array
    return response.routine[0]
  }

  async updateRoutine(
    routineId: string,
    routine: Partial<CreateRoutineRequest>
  ): Promise<HevyRoutine> {
    const response = await this.request<{ routine: HevyRoutine[] }>(`/v1/routines/${routineId}`, {
      method: "PUT",
      body: JSON.stringify({ routine }),
    })

    console.log("🔵 === HEVY API UPDATE RESPONSE ===")
    console.log("🔵 Response from Hevy API:")
    console.log(JSON.stringify(response, null, 2))
    console.log("🔵 === END RESPONSE ===")

    // Hevy API returns { routine: [routineObject] }, so unwrap the array
    return response.routine[0]
  }

  // Routine Folders
  async getRoutineFolders(): Promise<HevyRoutineFoldersResponse> {
    return this.request<HevyRoutineFoldersResponse>("/v1/routine_folders")
  }

  async createRoutineFolder(
    folder: CreateRoutineFolderRequest
  ): Promise<HevyRoutineFolder> {
    return this.request<HevyRoutineFolder>("/v1/routine_folders", {
      method: "POST",
      body: JSON.stringify(folder),
    })
  }

  // Exercise Templates
  async getExerciseTemplates(): Promise<HevyExerciseTemplatesResponse> {
    return this.request<HevyExerciseTemplatesResponse>("/v1/exercise_templates")
  }

  async getExerciseHistory(
    exerciseTemplateId: string,
    startDate?: string,
    endDate?: string
  ): Promise<HevyExerciseHistory> {
    let url = `/v1/exercise_history/${exerciseTemplateId}`
    const params = new URLSearchParams()

    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    return this.request<HevyExerciseHistory>(url)
  }
}
