import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db/gamedata/client'
import { db as user_db } from '$lib/server/db/users/client'
import { characters, guilds } from '$lib/server/db/gamedata/schema'
import { sql, eq, and, or } from 'drizzle-orm'
import { users } from '$lib/server/db/users/schema'
import { alias } from 'drizzle-orm/sqlite-core'
import type { Config } from '@sveltejs/adapter-vercel'
import { BYPASS_TOKEN } from '$env/static/private'

export const config: Config = {
    runtime: 'nodejs20.x',
    isr: {
        expiration: 60,
        bypassToken: BYPASS_TOKEN,
    }
}

const guildMaster = alias(characters, 'guildMaster')
const requestingCharacter = alias(characters, 'requesting')

const { id: _gmid, userId: _gmuser, visibility: _gmvis, submittedAt: _gmsubmit, ...gm } = guildMaster
const { id: _gid, guildMasterId: _ggm, submittedAt: _gsubmit, ...g } = guilds

const prepared_guild = db.select({ guild: g, guildMaster: gm }).from(guilds)
    .leftJoin(characters, eq(guilds.id, characters.guildId))
    .leftJoin(guildMaster, eq(guildMaster.id, guilds.guildMasterId))
    .leftJoin(requestingCharacter, eq(requestingCharacter.userId, sql.placeholder('userId')))
    .where(and(
        eq(guilds.id, sql.placeholder('id')),
        or(
            eq(characters.userId, sql.placeholder('userId')),
            eq(requestingCharacter.guildId, guilds.id),
            eq(guilds.visibility, 'public'),
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

    // console.log(await db.query.guilds.findMany({
    //     columns: {
    //         name: true,
    //     },
    //     with: {
    //         characters: true
    //     },
    //     where: ((guilds, { eq }) => eq(guilds.id, id))
    // }))

    const data = await prepared_guild.get({ id, userId: user?.id || null, role: user?.role || 'user' })

    return json({ type: 'guild', ...data })
}