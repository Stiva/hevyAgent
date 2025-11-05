import { NextRequest, NextResponse } from "next/server"
import { hevyClient } from "@/lib/hevy-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")

    const workouts = await hevyClient.getWorkouts(page, pageSize)
    return NextResponse.json(workouts)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch workouts", message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const workout = await hevyClient.createWorkout(body)
    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to create workout", message },
      { status: 500 }
    )
  }
}
