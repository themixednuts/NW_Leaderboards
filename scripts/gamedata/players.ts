import { getTableColumns, isNotNull, or, Query, sql } from "drizzle-orm"
import { characters } from "../../src/lib/schemas/gamedata"
import { db, client } from "./client"
import { file, Glob } from 'bun'
import { InArgs } from "@libsql/client/."

const glob = new Glob('**/*.json')
const BATCH_SIZE = 30

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
const stmts: Query[] = []
const arr: typeof characters.$inferInsert[] = []
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

      players.forEach(player => arr.push({
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

    } catch (e) {
      console.log(e)
      break
    }
  }
  console.log('Parsed: ', path, ' ', performance.now() - s, 'ms')
}
console.log('Batching statements in sizes of', BATCH_SIZE, '...')
let i = 1
for (const chunk of chunkArray(arr, BATCH_SIZE)) {
  console.write('\r' + ' '.repeat(process.stdout.columns))
  const len = Math.ceil(arr.length / BATCH_SIZE)
  console.write(`\rBatch ${(i).toString().padStart(len.toString().length)}/${len}`)

  const columnNames = getTableColumns(characters)
  const stmt = db.insert(characters).values(chunk)
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
    }).toSQL()
  stmts.push(stmt)
  ++i
}

const tx = await client.transaction('write')
console.log('\nExecuting statements...')
for (const [idx, stmt] of stmts.entries()) {
  try {
    const { rowsAffected } = await tx.execute({
      sql: stmt.sql,
      args: stmt.params as InArgs
    })
    console.write(`\r${idx + 1} / ${stmts.length} -> Affected Rows: ${rowsAffected}`)

  } catch (e) {
    console.log(e)
    console.log(stmt)
    break
  }
}
await tx.commit()
console.log('\nExecuted statements.')

function* chunkArray<T>(arr: T[], chunkSize: number): Generator<T[], void, void> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}
