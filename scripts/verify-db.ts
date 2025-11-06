import { Pool } from "@neondatabase/serverless"

const REQUIRED_TABLES = [
  "users",
  "accounts",
  "sessions",
  "verification_tokens",
]

const EXPECTED_COLUMNS = {
  users: ["id", "name", "email", "emailVerified", "image"],
  accounts: [
    "userId",
    "type",
    "provider",
    "providerAccountId",
    "refresh_token",
    "access_token",
    "expires_at",
    "token_type",
    "scope",
    "id_token",
    "session_state",
  ],
  sessions: ["sessionToken", "userId", "expires"],
  verification_tokens: ["identifier", "token", "expires"],
}

async function verifyDatabase() {
  console.log("🔍 Starting database verification...\n")

  // Check DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set in environment variables")
    process.exit(1)
  }
  console.log("✅ DATABASE_URL is set")

  // Create pool connection
  let pool: Pool
  try {
    pool = new Pool({ connectionString: databaseUrl })
    console.log("✅ Pool connection created")
  } catch (error) {
    console.error("❌ Failed to create pool connection:", error)
    process.exit(1)
  }

  try {
    // Test database connection
    console.log("\n📡 Testing database connection...")
    const result = await pool.query("SELECT NOW()")
    console.log("✅ Database connection successful")
    console.log(`   Server time: ${result.rows[0].now}`)

    // Check if tables exist
    console.log("\n📋 Checking for required tables...")
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `
    const tablesResult = await pool.query(tablesQuery)
    const existingTables = tablesResult.rows.map((row) => row.table_name)

    let allTablesExist = true
    for (const table of REQUIRED_TABLES) {
      if (existingTables.includes(table)) {
        console.log(`✅ Table '${table}' exists`)
      } else {
        console.log(`❌ Table '${table}' is MISSING`)
        allTablesExist = false
      }
    }

    if (!allTablesExist) {
      console.error(
        "\n⚠️  Some tables are missing. Run migrations with: npx drizzle-kit push"
      )
      process.exit(1)
    }

    // Check table schemas
    console.log("\n🔎 Verifying table schemas...")
    for (const [table, expectedColumns] of Object.entries(EXPECTED_COLUMNS)) {
      const columnsQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
      `
      const columnsResult = await pool.query(columnsQuery, [table])
      const existingColumns = columnsResult.rows.map((row) => row.column_name)

      const missingColumns = expectedColumns.filter(
        (col) => !existingColumns.includes(col)
      )

      if (missingColumns.length > 0) {
        console.log(
          `⚠️  Table '${table}' is missing columns: ${missingColumns.join(", ")}`
        )
      } else {
        console.log(`✅ Table '${table}' schema is correct`)
      }
    }

    // Test write permissions
    console.log("\n✍️  Testing database write permissions...")
    try {
      await pool.query("BEGIN")
      await pool.query(
        "INSERT INTO users (id, email) VALUES ($1, $2)",
        [`test-${Date.now()}`, `test-${Date.now()}@example.com`]
      )
      await pool.query("ROLLBACK")
      console.log("✅ Database write permissions OK (transaction rolled back)")
    } catch (error) {
      console.error("❌ Database write test failed:", error)
      await pool.query("ROLLBACK")
    }

    // Check for existing data
    console.log("\n📊 Checking existing data...")
    for (const table of REQUIRED_TABLES) {
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`)
      const count = parseInt(countResult.rows[0].count)
      if (count > 0) {
        console.log(`   ${table}: ${count} record(s)`)
      } else {
        console.log(`   ${table}: empty`)
      }
    }

    console.log("\n✨ Database verification complete!")
    console.log("\n💡 Next steps:")
    console.log("   1. If all tables exist but are empty, try logging in")
    console.log("   2. Check Vercel logs for any runtime errors")
    console.log(
      "   3. Verify AUTH_SECRET is set in Vercel environment variables"
    )
    console.log("   4. Ensure Google OAuth redirect URIs include all Vercel URLs")
  } catch (error) {
    console.error("\n❌ Verification failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run verification
verifyDatabase().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
