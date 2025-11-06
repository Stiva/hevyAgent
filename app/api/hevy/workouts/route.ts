import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const endpoint = `/api/hevy/workouts?page=${page}&pageSize=${pageSize}`

  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const workouts = await hevyClient.getWorkouts(page, pageSize)

    // Log success in development
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Route Success:", {
        timestamp,
        endpoint,
        status: 200,
        resultsCount: workouts.workouts?.length || 0,
      })
    }

    return NextResponse.json(workouts)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    // Determine appropriate status code
    let status = 500
    let errorType = "INTERNAL_ERROR"

    if (message.includes("Unauthorized") || message.includes("log in")) {
      status = 401
      errorType = "UNAUTHORIZED"
    } else if (message.includes("API key not configured")) {
      status = 403
      errorType = "API_KEY_NOT_CONFIGURED"
    } else if (message.includes("Invalid or expired Hevy API key")) {
      status = 403
      errorType = "INVALID_API_KEY"
    }

    // Enhanced error logging
    console.error("❌ API Route Error:", {
      timestamp,
      endpoint,
      errorType,
      status,
      message,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: "Failed to fetch workouts",
        message,
        errorType,
        timestamp,
      },
      { status }
    )
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()
  const endpoint = "/api/hevy/workouts"

  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const body = await request.json()
    const workout = await hevyClient.createWorkout(body)

    // Log success in development
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Route Success:", {
        timestamp,
        endpoint,
        method: "POST",
        status: 201,
      })
    }

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    // Determine appropriate status code
    let status = 500
    let errorType = "INTERNAL_ERROR"

    if (message.includes("Unauthorized") || message.includes("log in")) {
      status = 401
      errorType = "UNAUTHORIZED"
    } else if (message.includes("API key not configured")) {
      status = 403
      errorType = "API_KEY_NOT_CONFIGURED"
    } else if (message.includes("Invalid or expired Hevy API key")) {
      status = 403
      errorType = "INVALID_API_KEY"
    }

    // Enhanced error logging
    console.error("❌ API Route Error:", {
      timestamp,
      endpoint,
      method: "POST",
      errorType,
      status,
      message,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: "Failed to create workout",
        message,
        errorType,
        timestamp,
      },
      { status }
    )
  }
}
