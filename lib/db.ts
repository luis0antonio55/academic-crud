import { createClient } from "@libsql/client"

const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN

if (!url) {
  throw new Error("Missing TURSO_DATABASE_URL or LIBSQL_URL environment variable")
}

export const db = createClient({
  url,
  authToken,
})