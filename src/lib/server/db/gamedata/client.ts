import { createClient } from '@libsql/client'
import { TURSO_AUTH, TURSO_GAMEDATA_AUTH, TURSO_GAMEDATA_URL, TURSO_NW_AUTH } from '$env/static/private'
import { drizzle } from "drizzle-orm/libsql"
import * as schema from '$lib/server/db/gamedata/schema'

export const client = createClient({
    url: TURSO_GAMEDATA_URL,
    authToken: TURSO_GAMEDATA_AUTH,
})

export const db = drizzle(client, { schema })