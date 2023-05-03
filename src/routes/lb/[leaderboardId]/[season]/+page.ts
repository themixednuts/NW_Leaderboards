import { goto } from '$app/navigation'
import { page } from '$app/stores'
import type { PageLoad } from './$types'

export const load = (async ({ fetch, params, parent }) => {
  const leaderboardId = params.leaderboardId
  const { currentSeason } = await parent()
  const validSeasons = ['q1', 's1']
  const seasonId = validSeasons.includes(params.season)
    ? params.season
    : currentSeason

  const response = await fetch(
    `https://lb.jakel.rocks/json/${leaderboardId}/${seasonId}?size=1000`
  )

  if (response.status !== 200) {
  }

  const json: LeaderboardAPIBoardResponse = await response.json()

  return {
    json: json.data,
    id: leaderboardId,
  } as const
}) satisfies PageLoad
