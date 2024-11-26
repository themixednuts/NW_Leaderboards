import { db } from "@/server/db/gamedata/client"
import { searchCompaniesAndCharactersByName } from "@/server/db/gamedata/helpers"
import { characters, guilds } from "@/server/db/gamedata/schema"
import { p_search } from "@/server/db/gamedata/statements"
import { fail, type Actions } from "@sveltejs/kit"
import { and, eq, inArray, like, or, sql } from "drizzle-orm"
import { union } from "drizzle-orm/sqlite-core"

export const actions = {
  search: async ({ request, locals }) => {

    const data = await request.formData()
    const q = data.get('q') as string

    // db.select().from(guilds).where(eq(guilds.id))

    const session = await locals.auth()

    const results = await searchCompaniesAndCharactersByName(q, session?.user)
    if (!results) return fail(400, { message: 'No Results' })

    return {
      results
    }
  }

} satisfies Actions
