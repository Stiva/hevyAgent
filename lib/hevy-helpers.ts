// Helper functions for Hevy API operations with authentication
import { auth } from "@clerk/nextjs/server"
import { getUserApiKey } from "@/lib/db/user-api-keys"
import { HevyClient } from "@/lib/hevy-client"

/**
 * Get authenticated user's Hevy client instance
 * Throws error if user is not authenticated or API key is not configured
 */
export async function getAuthenticatedHevyClient(): Promise<HevyClient> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized: Please log in to access this resource")
  }

  const apiKey = await getUserApiKey(userId)

  if (!apiKey) {
    throw new Error(
      "Hevy API key not configured. Please add your API key in settings."
    )
  }

  return new HevyClient(apiKey)
}

