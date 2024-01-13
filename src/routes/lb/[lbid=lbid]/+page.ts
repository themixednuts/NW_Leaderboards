import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params, parent }) => {
  redirect(301, `/lb/${params.lbid}/${(await parent()).currentSeason}`);
  return {}
}) satisfies PageLoad
