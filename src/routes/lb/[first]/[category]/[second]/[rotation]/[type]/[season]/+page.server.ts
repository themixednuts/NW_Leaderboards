import { match_leaderboard, type LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ request, locals, fetch, url, params: { season, type, first, second, category, rotation }, setHeaders, parent, url: { searchParams } }) => {
  const { leaderboards } = await parent()

  const displayName = searchParams.get('q')
  const page = searchParams.get('p')
  const leaderboard = leaderboards.find(lb => match_leaderboard(lb, {
    //@ts-expect-error
    FirstLevelCategory: first,
    Category: category,
    SecondLevelCategory: second,
    //@ts-expect-error
    Rotation: rotation,
    CharacterLeaderboard: type === 'character' ? true : undefined,
    FactionLeaderboard: type === 'faction' ? true : undefined,
    GroupLeaderboard: type === 'group' ? true : undefined,
    CompanyLeaderboard: type === 'company' ? true : undefined,
    //@ts-expect-error
    DisplayName: displayName,
  }))

  if (!leaderboard) {
    console.log('No leaderboard found')

    return error(400, `This category is not tracked by ${type}`)
  }

  const id = type === 'faction' ? leaderboard.FactionLeaderboardDefinitionId : leaderboard.LeaderboardDefinitionId
  if (!id) {
    console.log('No leaderboard id found')
    return error(400, 'Leaderboard ID not found')
  }
  // const link = `/lb/api/leaderboard/${id}/${season}/1`

  // console.log('page.server.ts', request.headers, url)
  // const json = fetch(link, {
  //   headers: {
  //     host: url.host,
  //   }
  // }).then(res => res.json() as Promise<LeaderboardAPIBoardItem[]>)
  // json.catch(e => console.log(e))


  const api = `https://api.nwlb.info/json/${id}/${season}?size=100000&eid=true`
  const data = fetch(api).then(res => res.json() as Promise<LeaderboardAPIBoardItem[]>)
  data.catch((e) => {
    console.log(e)
  })

  return {
    json: data,
    leaderboard,
  }
}) satisfies PageServerLoad
