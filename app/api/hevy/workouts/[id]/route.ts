import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const workout = await hevyClient.getWorkout(params.id)
    return NextResponse.json(workout)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("Unauthorized") ? 401 : message.includes("API key") ? 403 : 500
    return NextResponse.json(
      { error: "Failed to fetch workout", message },
      { status }
    )
  }
}
