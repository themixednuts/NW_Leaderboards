import { createClient } from '@libsql/client'
import { TURSO_URL, TURSO_NW_AUTH, TURSO_AUTH } from '$env/static/private'
import { drizzle } from "drizzle-orm/libsql"
import * as schema from '$lib/server/db/users/schema'

export const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_NW_AUTH,
})

export const db = drizzle(client, { schema })
