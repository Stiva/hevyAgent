import { NextRequest, NextResponse } from "next/server"
import { hevyClient } from "@/lib/hevy-client"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workout = await hevyClient.getWorkout(params.id)
    return NextResponse.json(workout)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch workout", message },
      { status: 500 }
    )
  }
}
