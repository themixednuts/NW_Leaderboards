import type { LayoutServerLoad } from './$types'
import { get_valid_seasons } from '$lib/server/db/utils'
import { leaderboard_datatable, match_leaderboard } from '$lib/leaderboard/utils'
import { FirstLevelCategory } from '$lib/leaderboard/types'
import type { Config } from '@sveltejs/adapter-vercel'
import { BYPASS_TOKEN } from '$env/static/private'

export const config: Config = {
  runtime: 'nodejs20.x',
}


const leaderboard_results = await leaderboard_datatable()

export const load = (async ({ params: { first } }) => {
  const inactive = first === 'inactive'
  const seasons = await get_valid_seasons()
  const leaderboards = leaderboard_results.filter(leaderboard => {
    if (!inactive && match_leaderboard(leaderboard, { FirstLevelCategory: FirstLevelCategory.Inactive })) { return false }
    if (!first) { return true }
    return match_leaderboard(leaderboard, {
      //@ts-expect-error
      FirstLevelCategory: first,
    })
  })

  return {
    seasons,
    leaderboards
  }
}) satisfies LayoutServerLoad
