import { logs } from "@/schemas/gamedata"
import { db } from "@/server/db/gamedata/client"
import { eq, sql } from "drizzle-orm"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

const prepared = db.query.logs.findMany({
  where: eq(logs.userId, sql.placeholder('user'))
}).prepare()

export const load = (async ({ locals }) => {
  const session = await locals.auth()
  if (!session?.user?.id) error(400)

  const logs = prepared.all({
    user: session.user.id
  })

  logs.catch(e => console.log(e))

  return {
    logs
  }

}) satisfies PageServerLoad
