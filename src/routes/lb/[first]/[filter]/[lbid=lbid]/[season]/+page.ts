import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { get } from '@vercel/edge-config'

export const load = (async ({ fetch, params: { lbid, season, first } }) => {

  const json = fetch(`https://api.nwlb.info/json/${lbid}/${await get('season')}?size=1000`).then((res) => res.json() as unknown as LeaderboardAPIBoardItem[])
  json.catch(e => console.log(e))

  return {
    json,
  }
}) satisfies PageLoad  