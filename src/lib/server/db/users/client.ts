import { createClient } from '@libsql/client'
import { TURSO_AUTH, TURSO_URL, TURSO_URL_DEV } from '$env/static/private'
import { drizzle } from "drizzle-orm/libsql"
import * as schema from '$lib/server/db/users/schema'
import { dev } from '$app/environment'


const client = createClient({
  url: dev ? TURSO_URL_DEV : TURSO_URL,
  authToken: TURSO_AUTH,
})

export const db = drizzle(client, { schema })