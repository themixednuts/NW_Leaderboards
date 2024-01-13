import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { LEADERBOARD_ID_MAP } from '$lib/leaderboard/leaderboardmap'

export const load = (async ({ fetch, params: { lbid, season } }) => {

  // setHeaders({
  //   'cache-control': "public,s-maxage=9000"
  // })

  const validSeasons = ['q1', 's1', 's2', 's3', 's4']
  const seasonId = validSeasons.includes(season) ? season : validSeasons.at(-1)

  const json = fetch(`https://api.nwlb.info/json/${lbid}/${seasonId}?size=1000`).then((res) => res.json().then(res => res as LeaderboardAPIBoardResponse))

  if (!validSeasons.includes(season)) {
    redirect(301, `/lb/${lbid}/${validSeasons.at(-1)}`);
  }

  return {
    streamed: {
      json,
    },
    id: lbid as keyof typeof LEADERBOARD_ID_MAP,
  } as const
}) satisfies PageLoad
