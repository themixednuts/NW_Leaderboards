import { redirect } from '@sveltejs/kit'
import { validSeasons } from '../../utils'
import type { PageLoad } from './$types'

export const load = (async ({ fetch, params: { lbid, season } }) => {

  const seasonId = validSeasons.includes(season) ? season : validSeasons.at(-1)
  if (!validSeasons.includes(season)) {
    redirect(301, `/lb/${lbid}/${validSeasons.at(-1)}`);
  }

  const json = fetch(`https://api.nwlb.info/json/${lbid}/${seasonId}?size=1000`).then((res) => res.json() as unknown as LeaderboardAPIBoardItem[])

  return {
    json,
    id: lbid,
  } as const
}) satisfies PageLoad  