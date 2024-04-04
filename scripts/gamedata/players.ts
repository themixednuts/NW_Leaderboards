import { getTableColumns, isNotNull, or, sql } from "drizzle-orm"
import { characters } from "../../src/lib/server/db/gamedata/schema"
import { db } from "./client"
import { file, Glob } from 'bun'

const glob = new Glob('**/*.json')

export interface PlayerData {
  playerFaction: number
  playerIcon: PlayerIcon
  playerId: string
  playerLevel: number
  playerName: string
  playerWorldId: string
  playerGuildId?: string
}
export interface PlayerIcon {
  backgroundColor: string
  backgroundImagePath: string
  foregroundColor: string
  foregroundImagePath: string
  midgroundColor: string
  midgroundImagePath: string
}

const playerData = "/media/gamedisk/Games/Steam/steamapps/common/New World/logs/playerdata"
for await (const path of glob.scan(playerData)) {
  console.log('Parsing: ', path)
  const s = performance.now()
  const file_handle = file(`${playerData}/${path}`)
  const text = await file_handle.text()

  const lines = text.split('\n')
  for (const [index, line] of lines.entries()) {
    console.write('\r' + ' '.repeat(process.stdout.columns))
    console.write(`\r${path}: ${index} / ${lines.length - 1}`)

    try {
      if (!line.length) continue
      const players: PlayerData[] = JSON.parse(line)

      const normalized = players.map(player => ({
        id: player.playerId,
        name: player.playerName,
        level: player.playerLevel,
        guildId: player.playerGuildId,
        factionId: player.playerFaction,
        foregroundImagePath: player.playerIcon.foregroundImagePath,
        midgroundImagePath: player.playerIcon.midgroundImagePath,
        backgroundImagePath: player.playerIcon.backgroundImagePath,
        foregroundColor: player.playerIcon.foregroundColor,
        midgroundColor: player.playerIcon.midgroundColor,
        backgroundColor: player.playerIcon.backgroundColor,
        worldId: player.playerWorldId,
      }))
      const columnNames = getTableColumns(characters)
      await db.insert(characters).values(normalized)
        .onConflictDoUpdate({
          target: characters.id,
          set: {
            name: sql.raw(`COALESCE(EXCLUDED.${columnNames.name.name}, characters.${columnNames.name.name})`),
            guildId: sql.raw(`COALESCE(EXCLUDED.${columnNames.guildId.name}, characters.${columnNames.guildId.name})`),
            level: sql.raw(`COALESCE(EXCLUDED.${columnNames.level.name},characters.${columnNames.level.name})`),
            factionId: sql.raw(`COALESCE(EXCLUDED.${columnNames.factionId.name},${columnNames.factionId.name})`),
            foregroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.foregroundImagePath.name},characters.${columnNames.foregroundImagePath.name})`),
            backgroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.backgroundImagePath.name},characters.${columnNames.backgroundImagePath.name})`),
            midgroundImagePath: sql.raw(`COALESCE(EXCLUDED.${columnNames.midgroundImagePath.name},characters.${columnNames.midgroundImagePath.name})`),
            foregroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.foregroundColor.name},characters.${columnNames.foregroundColor.name})`),
            backgroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.backgroundColor.name},characters.${columnNames.backgroundColor.name})`),
            midgroundColor: sql.raw(`COALESCE(EXCLUDED.${columnNames.midgroundColor.name}, characters.${columnNames.midgroundColor.name})`),
            worldId: sql.raw(`COALESCE(EXCLUDED.${columnNames.worldId.name},characters.${columnNames.worldId.name})`),
            steamAppId: sql.raw(`COALESCE(EXCLUDED.${columnNames.steamAppId.name}, characters.${columnNames.steamAppId.name})`),
            updatedAt: sql`CURRENT_TIMESTAMP`
          },
          where: or(
            isNotNull(sql.raw(`EXCLUDED.${columnNames.name.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.guildId.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.level.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.factionId.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.foregroundImagePath.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.backgroundImagePath.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.midgroundImagePath.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.foregroundColor.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.backgroundColor.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.midgroundColor.name}`)),
            isNotNull(sql.raw(`EXCLUDED.${columnNames.worldId.name}`)),
          )
        })
    } catch (e) {
      console.log(e)
      break
    }
  }
  console.log('Parsed: ', path, ' ', performance.now() - s, 'ms')
}
