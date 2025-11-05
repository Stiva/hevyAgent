import { NextRequest, NextResponse } from "next/server"
import { hevyClient } from "@/lib/hevy-client"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    return NextResponse.json(
      { error: "Failed to fetch exercise history", message },
      { status: 500 }
    )
  }
}
