import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { leaderboardIdMap } from '$lib/leaderboardmap'

export const load = (async ({ fetch, params, parent }) => {
  const { leaderboardId } = params
  const { currentSeason } = await parent()
  const validSeasons = ['q1', 's1', 's2']
  const seasonId = validSeasons.includes(params.season)
    ? params.season
    : currentSeason

  const response = await fetch(
    `https://lb.jakel.rocks/json/${leaderboardId}/${seasonId}?size=1000`
  )


  if (response.status !== 200) {
  }

  if (!validSeasons.includes(params.season)) {
    console.log("here")
    throw redirect(301, `/lb/${params.leaderboardId}/${currentSeason}`)
  }

  const json: LeaderboardAPIBoardResponse = await response.json()

  return {
    json: json.data,
    id: leaderboardId as keyof typeof leaderboardIdMap,
  } as const
}) satisfies PageLoad
