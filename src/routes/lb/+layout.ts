import { match_leaderboard } from '$lib/leaderboard/utils'
import type { LayoutLoad } from './$types'

export const load = (async ({ params: { first, category, second, type, rotation }, data, url: { searchParams } }) => {
    const displayName = searchParams.get('q')
    const lbs = data.lbs.then(lbs => {
        const lb = lbs.leaderboards.find(leaderboard => {
            return match_leaderboard(leaderboard, {
                //@ts-expect-error
                FirstLevelCategory: first,
                Category: category,
                SecondLevelCategory: second,
                //@ts-expect-error
                Rotation: rotation,
                CharacterLeaderboard: type === 'character' ? true : undefined,
                FactionLeaderboard: type === 'faction' ? true : undefined,
                GroupLeaderboard: type === 'group' ? true : undefined,
                CompanyLeaderboard: type === 'company' ? true : undefined,
                //@ts-expect-error
                DisplayName: displayName,
            })
        })
        const leaderboards = lbs.leaderboards.filter(leaderboard => {
            //@ts-expect-error
            return match_leaderboard(leaderboard, { FirstLevelCategory: first })
        })
        return {
            seasons: lbs.seasons,
            lb,
            leaderboards,
        }
    })

    return {
        lbs
    }
}) satisfies LayoutLoad