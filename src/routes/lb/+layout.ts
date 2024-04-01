import { match_leaderboard } from '$lib/leaderboard/utils'
import type { LayoutLoad } from './$types'

export const load = (async ({ params: { first, category, second, type, rotation }, data, url: { searchParams } }) => {
  const displayName = searchParams.get('q')
  const leaderboards = data.leaderboards.filter(leaderboard => match_leaderboard(leaderboard, { FirstLevelCategory: first }))

  return {
    ...data,
    leaderboards,
  }
}) satisfies LayoutLoad
