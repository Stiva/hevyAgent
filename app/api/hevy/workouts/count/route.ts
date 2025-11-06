import { NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET() {
  const timestamp = new Date().toISOString()
  const endpoint = "/api/hevy/workouts/count"

  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const count = await hevyClient.getWorkoutsCount()

    // Log success in development
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Route Success:", {
        timestamp,
        endpoint,
        status: 200,
      })
    }

    return NextResponse.json(count)
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
        error: "Failed to fetch workout count",
        message,
        errorType,
        timestamp,
      },
      { status }
    )
  }
}
