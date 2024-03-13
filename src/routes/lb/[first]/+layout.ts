import { error, redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import { leaderboard_datatable } from '$lib/leaderboard/leaderboard'

export const load = (async ({ route, params: { season, lbid, first, filter } }) => {

  const leaderboards = leaderboard_datatable()
    .then(tables => tables.filter(table => table.FirstLevelCategory.replaceAll(' ', '').replaceAll('.', '').toLowerCase() === first?.toLowerCase()))

  leaderboards.catch(e => console.log(e))

  return {
    leaderboards
  }
}) satisfies LayoutLoad
