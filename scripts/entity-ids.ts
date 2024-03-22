import { write } from "bun"
import { leaderboard_datatable } from "./lib/leaderboard"

const leaderboards = await leaderboard_datatable()
const SEASON = 's4'

interface LeaderboardItem {
    entityId: string
    rank: number
    value: number
    server: string
}

const m: Record<string, string[]> = {}
const ids = await Promise.all(leaderboards.flatMap(async (leaderboard) => {
    const { CharacterLeaderboard, FactionLeaderboard, GroupLeaderboard, CompanyLeaderboard, LeaderboardDefinitionId, FactionLeaderboardDefinitionId } = leaderboard
    const id = FactionLeaderboard ? FactionLeaderboardDefinitionId : LeaderboardDefinitionId

    return await fetch(`https://api.nwlb.info/json/${id}/${SEASON}?size=1000&eid=true`).then(async res => await (res.json() as Promise<LeaderboardItem[]>))
}))

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

const distinct = Object.keys(m).reduce((acc, k) => {
    acc[k] = Array.from(new Set(m[k]))
    return acc
}, {})

const distinctCount = Object.keys(distinct).reduce((acc, k) => {
    acc[k] = distinct[k].length
    return acc
}, {})

write('./output/entities.json', JSON.stringify(distinct))
