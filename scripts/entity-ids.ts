import { write } from "bun"
import { leaderboard_datatable } from "./lib/leaderboard"

console.log('Starting Script')
console.log('Fetching Leaderboards Datatsheet')
const t = performance.now()
let s = performance.now()
const leaderboards = await leaderboard_datatable()
console.log('Fetched! -> ', performance.now() - s, 'ms')
const SEASON = 's4'

interface LeaderboardItem {
  entityId: string
  rank: number
  value: number
  server: string
}

const m: Record<string, string[]> = {}
console.log('Fetching Leaderboard Stats')
s = performance.now()
const ids = await Promise.all(leaderboards.flatMap(async (leaderboard) => {
  const { CharacterLeaderboard, FactionLeaderboard, GroupLeaderboard, CompanyLeaderboard, LeaderboardDefinitionId, FactionLeaderboardDefinitionId } = leaderboard
  const id = FactionLeaderboard ? FactionLeaderboardDefinitionId : LeaderboardDefinitionId

  return await fetch(`https://api.nwlb.info/json/${id}/${SEASON}?size=1000&eid=true`).then(async res => await (res.json() as Promise<LeaderboardItem[]>))
}))
console.log('Fetched! -> ', performance.now() - s, 'ms')

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
      s.push(id)
    }
  }
}
console.log('Processed! -> ', performance.now() - s, 'ms')

console.log('Mapping Stats')
s = performance.now()
const distinct = Object.keys(m).reduce((acc, k) => {
  acc[k] = Array.from(new Set(m[k]))
  return acc
}, {})
console.log('Mapped! -> ', performance.now() - s)
console.log('Done! Total Time: ', performance.now() - t, 'ms')

const distinctCount = Object.keys(distinct).reduce((acc, k) => {
  acc[k] = distinct[k].length
  return acc
}, {})
console.log('Found: ', distinctCount)

write('./output/entities.json', JSON.stringify(distinct))
