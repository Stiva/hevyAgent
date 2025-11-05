import { NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET() {
  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const templates = await hevyClient.getExerciseTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("Unauthorized") ? 401 : message.includes("API key") ? 403 : 500
    return NextResponse.json(
      { error: "Failed to fetch exercise templates", message },
      { status }
    )
  }
}
