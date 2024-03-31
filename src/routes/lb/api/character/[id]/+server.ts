import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db/gamedata/client'
import { db as user_db } from '$lib/server/db/users/client'
import { characters, guilds } from '$lib/server/db/gamedata/schema'
import { like, sql, eq, and, or } from 'drizzle-orm'
import { users } from '$lib/server/db/users/schema'
import { alias } from 'drizzle-orm/sqlite-core'

import type { Config } from '@sveltejs/adapter-vercel'
import { BYPASS_TOKEN, TURSO_USERS_ID } from '$env/static/private'

export const config: Config = {
  runtime: 'nodejs20.x',
  // isr: {
  //     expiration: 60,
  //     bypassToken: BYPASS_TOKEN,
  // }
}

const { id, userId, submittedAt, visibility, steamAppId, ...rest } = characters
const { visibility: _v, submittedAt: _s, guildMasterId, id: _i, ...gRest } = guilds

// const guildMaster = alias(characters, 'guildMaster')
const requestingCharacter = alias(characters, 'requesting')

const prepared_character = db.select({
  character: rest,
  guild: gRest,
  // guildMaster
}).from(characters)
  .leftJoin(guilds, eq(sql`REPLACE(REPLACE(${characters.guildId}, '{', ''), '}', '')`, guilds.id))
  // .leftJoin(guildMaster, eq(guildMaster.id, guilds.guildMasterId))
  .leftJoin(requestingCharacter, and(eq(requestingCharacter.id, sql.placeholder('userId')), eq(requestingCharacter.guildId, guilds.id)))
  .where(and(
    eq(characters.id, sql.placeholder('id')),
    or(
      eq(characters.userId, sql.placeholder('userId')),
      eq(characters.visibility, 'public'),
      and(eq(characters.visibility, 'guild'), eq(requestingCharacter.guildId, characters.guildId)),
      eq(sql.placeholder('role'), 'admin'),
      eq(sql.placeholder('role'), 'maintainer'),
    )
  ))
  .prepare()

const prepared_user = user_db.select({ role: users.role, id: users.id }).from(users)
  .where(eq(users.id, sql.placeholder('id')))
  .prepare()

export const GET: RequestHandler = async ({ locals, params: { id } }) => {
  const session = await locals.auth()

  const user = await prepared_user.get({ id: session?.user?.id || null })
  const data = await prepared_character.get({ id, userId: user?.id || null, role: user?.role || 'user' })
  return json({ type: 'character', ...data })
}
