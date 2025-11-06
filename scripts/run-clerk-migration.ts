import { Pool } from "@neondatabase/serverless"

async function runMigration() {
  console.log("🔄 Running Clerk migration...")

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set in environment variables")
    process.exit(1)
  }

  const pool = new Pool({ connectionString: databaseUrl })

  try {
    console.log("📡 Connecting to database...")

    // Drop the foreign key constraint
    await pool.query(`
      ALTER TABLE user_api_keys
      DROP CONSTRAINT IF EXISTS user_api_keys_user_id_fkey;
    `)

    console.log("✅ Successfully removed foreign key constraint from user_api_keys")
    console.log("✅ Clerk user IDs can now be used in user_api_keys table")
    console.log("\n🎉 Migration complete!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigration().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
