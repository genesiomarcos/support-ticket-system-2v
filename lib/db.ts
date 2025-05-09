import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Optional: Set Neon config
neonConfig.fetchConnectionCache = true

// Create a SQL client
const sql = neon(process.env.NEON_DATABASE_URL!)

// Create a Drizzle client
export const db = drizzle(sql)

// Export the SQL client for raw queries
export { sql }
