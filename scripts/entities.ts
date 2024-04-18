console.log('starting?')
// // Yes, run with bun, suck it
import { write } from "bun"
import { leaderboard_datatable } from "./lib/leaderboard"

console.log('Starting Script')
console.log('Fetching Leaderboards Datatsheet')
const t = performance.now()
let s = performance.now()
const leaderboards = await leaderboard_datatable()
console.log('Fetched! -> ', performance.now() - s, 'ms')
const SEASON = 5
const seasons = Array.from({ length: SEASON + 1 }, (_, idx) => idx === 0 ? 'q1' : `s${idx}`) as readonly ('q1' | `s${number}`)[]

interface LeaderboardItem {
  entityId: string
  rank: number
  value: number
  server: string
}

const m: Record<string, string[]> = {}
console.log('Fetching Leaderboard Stats')
s = performance.now()
const lbs: { [k: string]: string | number | boolean }[] = []
const ids = await Promise.all(leaderboards.flatMap(async (leaderboard) => {
  const { LeaderboardDefinitionId, FactionLeaderboardDefinitionId } = leaderboard
  const ids = [FactionLeaderboardDefinitionId, LeaderboardDefinitionId]
  lbs.push({ leaderboard: leaderboard.LeaderboardId, 'hasFactionBoard': FactionLeaderboardDefinitionId ? true : false, 'IDs': ids.filter(Boolean).join(', ') })

  const fetches = ids.filter(Boolean).map(id => seasons.map(season => fetch(`https://api.nwlb.info/json/${id}/${season}?size=10000&eid=true`).then(res => res.json() as Promise<LeaderboardItem[]>)))
  return Promise.all(fetches.flat()).then(res => res.flat())
}))
// console.table(lbs)
console.log('\nFetched! -> ', performance.now() - s, 'ms')

console.log('Processing Stats')
s = performance.now()
for (const datas of ids) {
  if (!datas || !Array.isArray(datas)) continue
  for (const data of datas) {
    if (!data || !data.entityId) continue
    m[data.server] ??= []

    const s = m[data.server]
    const ids = data.entityId.split('_')
    for (const id of ids) {
      if (id.includes('{')) continue
      s.push(id)
    }
  }
}
console.log('Processed! -> ', performance.now() - s, 'ms')

console.log('Mapping Stats')
s = performance.now()
const distinct = Object.keys(m).reduce<{ [k: string]: string[] }>((acc, k) => {
  acc[k] = Array.from(new Set(m[k]))
  return acc
}, {})
console.log('Mapped! -> ', performance.now() - s)
console.log('Done! Total Time: ', performance.now() - t, 'ms')

const distinctCount = Object.keys(distinct).reduce<{ [k: string]: number }>((acc, k) => {
  acc[k] = distinct[k].length
  return acc
}, {})
console.table({ ...distinctCount, total: Object.values(distinctCount).reduce((acc, curr) => acc + curr, 0) })

// COMMENT THIS SECTION OUT IF YOU DON'T WANT TO HANDLE DB
// ---------------------------------------------------------------
import { db, client } from './gamedata/client'
import { characters } from "../src/lib/schemas/gamedata"
import { isNull } from "drizzle-orm"

console.log('Syncing...')
s = performance.now()
// await client.sync()
console.log('Synced.', performance.now() - s, 'ms')

console.log("Getting missing characters.")
s = performance.now()
const missing = await db.select({ id: characters.id, worldId: characters.worldId, name: characters.name }).from(characters).where(isNull(characters.level))
console.log('#Missing Characters:', missing.length, '->', performance.now() - s, 'ms')

const worlds = await fetch('https://gt-servers.nwdb.info/server-status/d97f9hg7132dhasei12j93hdasr18j_gt').then(res => res.json() as Promise<{ servers: { worldId: string, worldName: string }[] }>)
for (const character of missing) {
  const world = worlds.servers.find(server => server.worldId === character.worldId)
  if (!world) continue
  const { worldName } = world
  const isInLeaderboards = distinct[worldName].find(id => id === character.id)
  if (isInLeaderboards) {
    console.log(character.name, 'recently added to leaderboards...skipping.')
    continue
  }
  console.log(character.name, `added to ${worldName}.`)
  distinct[worldName].push(character.id)
}
// ----------------------------------------------------------------

write('./output/entities.json', JSON.stringify(distinct))
