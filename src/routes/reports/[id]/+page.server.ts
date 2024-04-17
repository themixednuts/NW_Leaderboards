import { db } from '$lib/server/db/gamedata/client'
import { characters, guilds, logs } from '@/schemas/gamedata'
import { error } from '@sveltejs/kit'
import { eq, or, and, type InferSelectModel, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import type { PageServerLoad } from './$types'

// export type Report = {
//   character: typeof characters.$inferSelect & {
//     faction: typeof factions.$inferSelect,
//     guild: typeof guilds.$inferSelect & {
//       faction: typeof factions.$inferSelect
//     }
//   },
//   log: typeof logs.$inferSelect
// }

// const preparedReports = db.select({
//   character: {
//     ...characters,
//     faction: characterFaction,
//     guild: {
//       ...guilds,
//       faction: guildFaction
//     }
//   },
//   log: logs

// })
//   .from(characters_logs)
//   .leftJoin(characters, eq(characters.id, characters_logs.characterId))
//   .leftJoin(guilds, eq(guilds.id, characters.guildId))
//   .leftJoin(characterFaction, eq(characterFaction.id, characters.factionId))
//   .leftJoin(guildFaction, eq(guildFaction.id, guilds.factionId))
//   .leftJoin(logs, and(or(eq(logs.userId, sql.placeholder('userId')), eq(logs.visibility, "public")), or(eq(logs.relatedTo, characters_logs.logId), eq(logs.id, characters_logs.logId)), eq(characters_logs.characterId, logs.characterId)))
//   .where(eq(characters_logs.logId, sql.placeholder('logId'))).prepare()

const prepare = db.query.logs.findMany({
  columns: {
    characterId: false,
    userId: false,
    guildId: false,
    fileName: false,
  },
  with: {
    character: true,
    guild: true,
  },
  where: or(eq(logs.id, sql.placeholder('id')), eq(logs.relatedTo, sql.placeholder('id')))
}).prepare()

export const load = (async ({ locals, params: { id } }) => {
  const session = await locals.auth()

  if (!session?.user?.id) return error(400)
  const reports = prepare.all({ id })
  reports.catch(e => console.log(e))

  return {
    reports,
  }
}) satisfies PageServerLoad
