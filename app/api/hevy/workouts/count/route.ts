import { NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET() {
  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const count = await hevyClient.getWorkoutsCount()
    return NextResponse.json(count)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("Unauthorized") ? 401 : message.includes("API key") ? 403 : 500
    return NextResponse.json(
      { error: "Failed to fetch workout count", message },
      { status }
    )
  }
}
