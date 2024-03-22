import { error } from '@sveltejs/kit'
import type { LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'

export const load = (async ({ fetch, params: { season, type }, parent }) => {
  const { lbs } = await parent()
  const { lb } = await lbs
  const id = type === 'faction' ? lb?.FactionLeaderboardDefinitionId : lb?.LeaderboardDefinitionId
  const json = fetch(`https://api.nwlb.info/json/${id}/${season}?size=1000&eid=true`).then(async (res) => {
    if (!res.ok) error(res.status)
    return res.json() as Promise<LeaderboardAPIBoardItem[]>
  })
  json.catch((e) => { })

  return {
    json,
  }
})