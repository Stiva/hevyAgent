import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedHevyClient } from "@/lib/hevy-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hevyClient = await getAuthenticatedHevyClient()
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("start_date") || undefined
    const endDate = searchParams.get("end_date") || undefined

    const history = await hevyClient.getExerciseHistory(
      params.id,
      startDate,
      endDate
    )
    return NextResponse.json(history)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    const status = message.includes("Unauthorized") ? 401 : message.includes("API key") ? 403 : 500
    return NextResponse.json(
      { error: "Failed to fetch exercise history", message },
      { status }
    )
  }
}
