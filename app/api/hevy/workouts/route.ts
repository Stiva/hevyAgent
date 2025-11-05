import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET(request: NextRequest) {
  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")

    const workouts = await hevyClient.getWorkouts(page, pageSize)
    return NextResponse.json(workouts)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("Unauthorized") ? 401 : message.includes("API key") ? 403 : 500
    return NextResponse.json(
      { error: "Failed to fetch workouts", message },
      { status }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const body = await request.json()
    const workout = await hevyClient.createWorkout(body)
    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("Unauthorized") ? 401 : message.includes("API key") ? 403 : 500
    return NextResponse.json(
      { error: "Failed to create workout", message },
      { status }
    )
  }
}
