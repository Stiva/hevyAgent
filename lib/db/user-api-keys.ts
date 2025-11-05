// User API Keys Database Operations
import { sql } from "./index"

export interface UserApiKey {
  id: string
  user_id: string
  hevy_api_key: string
  created_at: Date
  updated_at: Date
}

/**
 * Get user's Hevy API key from database
 */
export async function getUserApiKey(userId: string): Promise<string | null> {
  const result = await sql`
    SELECT hevy_api_key 
    FROM user_api_keys 
    WHERE user_id = ${userId}
    LIMIT 1
  `
  
  if (result.length === 0) {
    return null
  }
  
  return result[0].hevy_api_key as string
}

/**
 * Save or update user's Hevy API key
 */
export async function saveUserApiKey(
  userId: string,
  hevyApiKey: string
): Promise<void> {
  // Validate API key format (basic validation)
  if (!hevyApiKey || hevyApiKey.trim().length === 0) {
    throw new Error("Hevy API key cannot be empty")
  }

  // Use upsert to insert or update
  await sql`
    INSERT INTO user_api_keys (user_id, hevy_api_key, updated_at)
    VALUES (${userId}, ${hevyApiKey.trim()}, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      hevy_api_key = EXCLUDED.hevy_api_key,
      updated_at = CURRENT_TIMESTAMP
  `
}

/**
 * Delete user's Hevy API key
 */
export async function deleteUserApiKey(userId: string): Promise<void> {
  await sql`
    DELETE FROM user_api_keys 
    WHERE user_id = ${userId}
  `
}

