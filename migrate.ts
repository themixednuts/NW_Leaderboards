import { eq } from 'drizzle-orm'
import * as schema from './src/lib/server/db/users/schema'
import { randomUUID } from 'crypto'
import { createClient } from '@libsql/client'
import { drizzle } from "drizzle-orm/libsql"

const { sessions } = schema

export const client = createClient({
    // url: 'file:replica.db',
    authToken: process.env.TURSO_NW_AUTH,
    // syncUrl: process.env.TURSO_GAMEDATA_URL!,
    url: process.env.TURSO_URL!
})

export const db = drizzle(client, { schema })

db.transaction(async (tx) => {
    const ids = await tx.select().from(sessions)
    for (const id of ids) {
        await db.update(sessions).set({
            id: randomUUID()
        }).where(eq(sessions.id, id.id))
    }
})
// db.update(sessions).set({
//     id: randomUUID()
// }).where(eq(sessions.id, sql`rowid`)).toSQL()

// console.log(stmt)