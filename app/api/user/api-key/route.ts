import { auth } from "@/lib/auth"
import { getUserApiKey, saveUserApiKey } from "@/lib/db/user-api-keys"
import { NextResponse } from "next/server"

// Force dynamic rendering for this route (uses auth which reads headers)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const apiKey = await getUserApiKey(session.user.id)

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 404 }
      )
    }

    // Return masked API key for security (show only last 4 characters)
    const maskedKey = apiKey.slice(-4).padStart(apiKey.length, "*")

    return NextResponse.json({
      apiKey: maskedKey,
      configured: true,
    })
  } catch (error) {
    console.error("Error fetching API key:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { apiKey } = body

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    // Basic validation
    if (apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: "API key cannot be empty" },
        { status: 400 }
      )
    }

    await saveUserApiKey(session.user.id, apiKey)

    return NextResponse.json({
      success: true,
      message: "API key saved successfully",
    })
  } catch (error) {
    console.error("Error saving API key:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

