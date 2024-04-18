import { createClient } from '@libsql/client'
import { drizzle } from "drizzle-orm/libsql"
import * as schema from '../../src/lib/schemas/gamedata'


export const client = createClient({
  // url: 'file:replica.db',
  authToken: process.env.TURSO_NW_AUTH,
  // syncUrl: process.env.TURSO_GAMEDATA_URL!,
  url: process.env.TURSO_GAMEDATA_URL!
})

export const db = drizzle(client, { schema })
