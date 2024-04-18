import { eq, getTableColumns, inArray, isNotNull, or, Query, sql } from "drizzle-orm"
import { client, db } from "./client"
import { file, Glob } from 'bun'
import { InArgs } from "@libsql/client/."
import { characters, guilds } from "../../src/lib/schemas/gamedata"

const GLOB = new Glob('**/*.json')

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

const GUILD_DATA_DIR = "/media/gamedisk/Games/Steam/steamapps/common/New World/logs/guildsdata"
const BATCH_SIZE = 50

const stmts: Query[] = []
const arr: typeof guilds.$inferInsert[] = []

for await (const path of GLOB.scan(GUILD_DATA_DIR)) {
  console.log('Parsing: ', path)
  const s = performance.now()
  const file_handle = file(`${GUILD_DATA_DIR}/${path}`)
  const text = await file_handle.text()

  const lines = text.split('\n')
  for (const [index, line] of lines.entries()) {
    console.write('\r' + ' '.repeat(process.stdout.columns))
    console.write(`\r${path}: ${index} / ${lines.length - 1}`)
    if (!line.length) continue
    const guildsarr: GuildData[] = JSON.parse(line)
    guildsarr.forEach(guild => arr.push({
      id: guild.guildId.replace(/\{|\}/g, ''),
      name: guild.guildName,
      guildmasterId: guild.guildMasterCharacterIdString,
      factionId: guild.faction,
      foregroundImagePath: guild.crestData.foregroundImagePath,
      backgroundImagePath: guild.crestData.backgroundImagePath,
      foregroundColor: guild.crestData.foregroundColor,
      backgroundColor: guild.crestData.backgroundColor,
      numClaims: guild.numClaims,
      numPlayers: guild.numMembers,
    }))
  }
  console.log('\nParsed: ', path, ' ', performance.now() - s, 'ms')
}
const columnNames = getTableColumns(guilds)

console.log('Batching statements in sizes of', BATCH_SIZE, '...')
let i = 1
for (const chunk of chunkArray(arr, BATCH_SIZE)) {
  console.write('\r' + ' '.repeat(process.stdout.columns))
  const len = Math.ceil(arr.length / BATCH_SIZE)
  console.write(`\rBatch ${(i).toString().padStart(len.toString().length)}/${len}`)
  let stmt = db.insert(guilds).values(chunk)
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
      }
    }).toSQL()
  stmts.push(stmt)
  stmt = db.update(characters).set({
    guildRank: 'governor'
  })
    .where(inArray(characters.id, chunk.map(guild => guild.guildmasterId!)))
    .toSQL()
  stmts.push(stmt)
  ++i
}

const tx = await client.transaction('write')
console.log('\nExecuting statements...')
for (const [idx, stmt] of stmts.entries()) {
  const { rowsAffected } = await tx.execute({
    sql: stmt.sql,
    args: stmt.params as InArgs
  })
  console.write('\r' + ' '.repeat(process.stdout.columns))
  console.write(`\r${(idx + 1).toString().padStart(stmts.length.toString().length)}/${stmts.length} -> Affected Rows: ${rowsAffected.toString().padStart(3)}`)
}
await tx.commit()
console.log('\nExecuted statements.')


function* chunkArray<T>(arr: T[], chunkSize: number): Generator<T[], void, void> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}
