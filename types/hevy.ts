// Hevy API Type Definitions
// Based on the official Hevy API documentation at https://api.hevyapp.com/docs/

export interface HevyWorkout {
  id: string
  title: string
  description?: string
  start_time: string // ISO 8601 timestamp
  end_time: string // ISO 8601 timestamp
  created_at: string
  updated_at: string
  exercises: HevyWorkoutExercise[]
}

export interface HevyWorkoutExercise {
  id: string
  exercise_template_id: string
  title: string
  notes?: string
  sets: HevySet[]
}

export type SetType = "normal" | "warmup" | "dropset" | "failure"

export interface RepRange {
  start?: number | null
  end?: number | null
}

export interface HevySet {
  id: string
  set_number: number
  set_type: SetType
  weight_kg?: number
  reps?: number
  distance_meters?: number
  duration_seconds?: number
  rpe?: number // Rate of Perceived Exertion (1-10)
  completed: boolean
}

export interface HevyWorkoutsResponse {
  page: number
  page_count: number
  workouts: HevyWorkout[]
}

export interface HevyWorkoutsCountResponse {
  workout_count: number
}

export interface HevyRoutine {
  id: string
  title: string
  folder_id?: number | null
  notes?: string
  exercises: HevyRoutineExercise[]
  created_at: string
  updated_at: string
}

export interface HevyRoutineExercise {
  id: string
  exercise_template_id: string
  title: string
  notes?: string
  superset_id?: number | null
  rest_seconds?: number | null
  sets: HevyRoutineSet[]
}

export interface HevyRoutineSet {
  type: SetType
  weight_kg?: number | null
  reps?: number | null
  distance_meters?: number | null
  duration_seconds?: number | null
  rpe?: number | null
  custom_metric?: number | null
  rep_range?: RepRange | null
}

export interface HevyRoutinesResponse {
  page: number
  page_count: number
  routines: HevyRoutine[]
}

export interface HevyRoutineFolder {
  id: string
  title: string
  index: number
  created_at: string
  updated_at: string
}

export interface HevyRoutineFoldersResponse {
  folders: HevyRoutineFolder[]
}

export interface HevyExerciseTemplate {
  id: string
  title: string
  type: "weight_reps" | "duration" | "distance_duration" | "weight_distance"
  muscle_group: string
  equipment_type?: string
  is_custom: boolean
}

export interface HevyExerciseTemplatesResponse {
  exercise_templates: HevyExerciseTemplate[]
}

export interface HevyExerciseHistory {
  exercise_template_id: string
  title: string
  entries: HevyExerciseHistoryEntry[]
}

export interface HevyExerciseHistoryEntry {
  workout_id: string
  workout_title: string
  date: string // ISO 8601 date
  sets: HevySet[]
}

export interface CreateWorkoutRequest {
  title: string
  description?: string
  start_time: string // ISO 8601 timestamp
  end_time: string // ISO 8601 timestamp
  exercises: CreateWorkoutExercise[]
}

export interface CreateWorkoutExercise {
  exercise_template_id: string
  notes?: string
  sets: CreateWorkoutSet[]
}

export interface CreateWorkoutSet {
  set_type: SetType
  weight_kg?: number
  reps?: number
  distance_meters?: number
  duration_seconds?: number
  rpe?: number
}

export interface CreateRoutineRequest {
  title: string
  folder_id?: number | null
  notes?: string
  exercises: CreateRoutineExercise[]
}

export interface CreateRoutineExercise {
  exercise_template_id: string
  notes?: string
  superset_id?: number | null
  rest_seconds?: number | null
  sets: HevyRoutineSet[]
}

export interface CreateRoutineFolderRequest {
  title: string
}

export interface HevyWorkoutEvent {
  id: string
  workout_id: string
  event_type: "created" | "updated" | "deleted"
  timestamp: string // ISO 8601 timestamp
}

export interface HevyWorkoutEventsResponse {
  page: number
  page_count: number
  events: HevyWorkoutEvent[]
}

// API Error Response
export interface HevyApiError {
  error: string
  message: string
  status_code: number
}
