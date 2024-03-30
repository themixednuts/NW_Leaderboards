import { getTableColumns, isNotNull, or, sql } from "drizzle-orm"
import { guilds } from "../../src/lib/server/db/gamedata/schema"
import { db } from "./client"
import { file, Glob } from 'bun'

const glob = new Glob('**/*.json')

export interface GuildData {
    crestData: CrestData
    faction: number
    guildId: string
    guildMasterCharacterIdString: string
    guildName: string
    numClaims: number
    numMembers: number
}
export interface CrestData {
    backgroundColor: string
    backgroundImagePath: string
    foregroundColor: string
    foregroundImagePath: string
}

const guildDataDir = "/media/gamedisk/Games/Steam/steamapps/common/New World/logs/guildsdata"
for await (const path of glob.scan(guildDataDir)) {
    console.log('Parsing: ', path)
    const file_handle = file(`${guildDataDir}/${path}`)
    const text = await file_handle.text()

    const lines = text.split(']')
    for (const line of lines) {
        if (!line.length) continue
        const guildsarr: GuildData[] = JSON.parse(line + ']')
        const normalized = guildsarr.map(guild => ({
            id: guild.guildId.replace(/\{|\}/g, ''),
            name: guild.guildName,
            guildMasterId: guild.guildMasterCharacterIdString,
            factionId: guild.faction,
            foregroundImagePath: guild.crestData.foregroundImagePath,
            backgroundImagePath: guild.crestData.backgroundImagePath,
            foregroundColor: guild.crestData.foregroundColor,
            backgroundColor: guild.crestData.backgroundColor,
            numClaims: guild.numClaims,
            numPlayers: guild.numMembers,
        }))

        const columnNames = getTableColumns(guilds)
        await db.insert(guilds).values(normalized)
            .onConflictDoUpdate({
                target: guilds.id,
                set: {
                    name: sql.raw(`COALESCE(EXCLUDED.${columnNames.name.name}, ${columnNames.name.name})`),
                    id: sql.raw(`COALESCE(EXCLUDED.${columnNames.id.name}, ${columnNames.id.name})`),
                    factionId: sql.raw(`COALESCE(EXCLUDED.${columnNames.factionId.name},${columnNames.factionId.name})`),
                    foregroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.foregroundImagePath.name},${columnNames.foregroundImagePath.name})`),
                    backgroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.backgroundImagePath.name},${columnNames.backgroundImagePath.name})`),
                    foregroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.foregroundColor.name},${columnNames.foregroundColor.name})`),
                    backgroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.backgroundColor.name},${columnNames.backgroundColor.name})`),
                    numClaims: sql.raw(`COALESCE(EXCLUDED.${columnNames.numClaims.name},${columnNames.numClaims.name})`),
                    numPlayers: sql.raw(`COALESCE(EXCLUDED.${columnNames.numPlayers.name},${columnNames.numPlayers.name})`),
                    updatedAt: sql`CURRENT_TIMESTAMP`
                },
                where: or(
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.name.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.id.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.factionId.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.foregroundImagePath.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.backgroundImagePath.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.foregroundColor.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.backgroundColor.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.numClaims.name}`)),
                    isNotNull(sql.raw(`EXCLUDED.${columnNames.numPlayers.name}`)),
                )
            })
    }
}