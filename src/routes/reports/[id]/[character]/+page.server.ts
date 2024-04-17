import { db } from '$lib/server/db/gamedata/client'
import { characters, guilds, logs } from '@/schemas/gamedata'
import { and, eq, or, sql } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { alias } from 'drizzle-orm/sqlite-core'

// const characterFaction = alias(factions, 'characterFaction')
// const guildFaction = alias(factions, 'guildFaction')

// const prepared = db.select({
//   character: {
//     ...characters,
//     faction: characterFaction,
//     guild: {
//       ...guilds,
//       faction: guildFaction
//     }
//   },
//   log: logs

// }).from(logs)
//   .leftJoin(characters, eq(characters.id, sql.placeholder('characterId')))
//   .leftJoin(characterFaction, eq(characterFaction.id, characters.factionId))
//   .leftJoin(guilds, eq(guilds.id, characters.guildId))
//   .leftJoin(guildFaction, eq(guildFaction.id, guilds.factionId))
//   .where(and(or(eq(logs.userId, sql.placeholder('userId')), eq(logs.visibility, "public")), or(and(eq(logs.relatedTo, sql.placeholder('logId')), eq(logs.characterId, sql.placeholder('characterId'))), and(eq(logs.id, sql.placeholder('logId')), eq(logs.characterId, sql.placeholder('characterId')))))).prepare()

const prepared = db.query.logs.findFirst({
  with: {
    character: true
  },
  where: and(or(eq(logs.id, sql.placeholder('id')), eq(logs.relatedTo, sql.placeholder('id'))), eq(logs.characterId, sql.placeholder('character')))
}).prepare()


export const load = (async ({ locals, params: { id, character, }, request }) => {
  const session = await locals.auth()

  if (!session?.user?.id) error(400)

  const report = prepared.get({
    // user: session.user.id,
    id,
    character,
  })

  return {
    report
  }
}) satisfies PageServerLoad
