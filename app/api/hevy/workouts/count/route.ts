import { NextResponse } from "next/server"
import { hevyClient } from "@/lib/hevy-client"

export async function GET() {
  try {
    const count = await hevyClient.getWorkoutsCount()
    return NextResponse.json(count)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch workout count", message },
      { status: 500 }
    )
  }
}
