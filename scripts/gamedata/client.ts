import { createClient } from '@libsql/client'
import { drizzle } from "drizzle-orm/libsql"
import * as schema from '../../src/lib/server/db/gamedata/schema'

const client = createClient({
    url: process.env.TURSO_GAMEDATA_URL!,
    authToken: process.env.TURSO_NW_AUTH,
})

export const db = drizzle(client, { schema })