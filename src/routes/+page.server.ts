import { db } from "@/server/db/gamedata/client"
import { characters, guilds } from "@/server/db/gamedata/schema"
import { fail, type Actions } from "@sveltejs/kit"
import { and, eq, inArray, like, or, sql } from "drizzle-orm"
import { union } from "drizzle-orm/sqlite-core"

const prepared = union(
  db.select({ id: characters.id, name: characters.name, type: sql<string>`'character'` }).from(characters)
    .where(
      and(
        like(characters.name, sql`'%' || ${sql.placeholder('name')} || '%'`),
        or(
          eq(characters.userId, sql.placeholder('userId')),
          eq(characters.visibility, 'public'),
          inArray(sql.placeholder('role'), ['admin', 'maintainer'])
        )
      )
    ),
  db.select({ id: guilds.id, name: guilds.name, type: sql<string>`'guild'` }).from(guilds).where(like(guilds.name, sql.placeholder('name'))),
).limit(10).prepare()

export const actions = {
  search: async ({ request, locals }) => {

    const data = await request.formData()
    const q = data.get('q')

    const session = await locals.auth()

    const results = await prepared.all({ name: q, userId: session?.user?.id ?? null, role: session?.user?.role ?? null })
    if (!results) return fail(400, { message: 'No Results' })

    return {
      results
    }
  }

} satisfies Actions
