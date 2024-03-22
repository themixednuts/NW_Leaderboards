import { leaderboard_datatable } from "./lib/leaderboard"
import { quicktypeJSON } from "./quicktype"
import { write } from 'bun'

export async function generate_leaderboard_types() {
    const s = performance.now()
    console.log('Fetching Leaderboards')
    const leaderboards = await leaderboard_datatable()
    console.log('Processed Leaderboards --> %fms', performance.now() - s)

    const s2 = performance.now()
    const typeName = 'LeaderboardData'
    console.log('Writing Types')
    const { lines } = await quicktypeJSON('typescript', typeName, JSON.stringify(leaderboards))
    write(`src/lib/leaderboard/types.ts`, lines.join('\n'))
    console.log('Processed Types        --> %fms', performance.now() - s2)
    console.log('Done! Total            --> %fms', performance.now() - s)
}

generate_leaderboard_types()