import type { LayoutServerLoad } from './$types'
import { get_valid_seasons } from '$lib/server/db/utils'
import { leaderboard_datatable, match_leaderboard } from '$lib/leaderboard/utils'
import { FirstLevelCategory } from '$lib/leaderboard/types'
import type { Config } from '@sveltejs/adapter-vercel'
import { BYPASS_TOKEN } from '$env/static/private'

export const config: Config = {
  runtime: 'nodejs20.x',
  isr: {
    expiration: 300,
    bypassToken: BYPASS_TOKEN,
  }
}

async function f(params: Parameters<LayoutServerLoad>[0]['params']) {
  const { first, type, rotation, second, category } = params
  const inactive = first === 'inactive'

  const seasons = await get_valid_seasons()
  const leaderboards = await leaderboard_datatable()
  const lbs = leaderboards.filter(leaderboard => {
    if (!inactive && match_leaderboard(leaderboard, { FirstLevelCategory: FirstLevelCategory.Inactive })) { return false }
    if (!first) { return true }
    return match_leaderboard(leaderboard, {
      //@ts-expect-error
      FirstLevelCategory: first,
    })
  })

  return {
    seasons,
    leaderboards: lbs
  }
}

export const load = (async ({ params }) => {
  const leaderboards = f(params)
  leaderboards.catch(e => console.log(e))

  return {
    lbs: leaderboards
  }
}) satisfies LayoutServerLoad
