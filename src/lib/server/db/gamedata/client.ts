import { createClient } from '@libsql/client'
import { TURSO_GAMEDATA_AUTH, TURSO_GAMEDATA_URL } from '$env/static/private'
import { drizzle } from "drizzle-orm/libsql"
import * as schema from '$lib/server/db/gamedata/schema'
import { dev } from '$app/environment'

export const client = createClient({
  url: dev ? 'file:replica.db' : TURSO_GAMEDATA_URL,
  authToken: TURSO_GAMEDATA_AUTH,
  syncUrl: dev ? TURSO_GAMEDATA_URL : undefined
})

export const db = drizzle(client, { schema })
