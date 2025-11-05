import { NextResponse } from "next/server"
import { hevyClient } from "@/lib/hevy-client"

export async function GET() {
  try {
    const templates = await hevyClient.getExerciseTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch exercise templates", message },
      { status: 500 }
    )
  }
}
