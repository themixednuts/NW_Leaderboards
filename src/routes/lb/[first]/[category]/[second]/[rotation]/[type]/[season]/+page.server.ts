import { match_leaderboard, type LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Config } from '@sveltejs/adapter-vercel'
import { BYPASS_TOKEN } from '$env/static/private'

export const config: Config = {
  runtime: 'nodejs20.x',
  // isr: {
  //     expiration: 60,
  //     bypassToken: BYPASS_TOKEN,
  // }
}

export const load = (async ({ params: { season, type, first, second, category, rotation }, parent, url: { searchParams }, locals }) => {
  const { leaderboards } = await parent()
  const displayName = searchParams.get('q')
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
  if (!leaderboard) error(400, `This category is not tracked by ${type}`)

  const id = type === 'faction' ? leaderboard.FactionLeaderboardDefinitionId : leaderboard.LeaderboardDefinitionId
  if (!id) error(400, 'Leaderboard ID not found')

  const api = `https://api.nwlb.info/json/${id}/${season}?size=1000&eid=true`
  const json = fetch(api).then(async (res) => {
    if (!res.ok) return error(res.status)
    const json = res.json() as Promise<LeaderboardAPIBoardItem[]>
    return json
  })

  json.catch((e) => {
    console.log(e)
  })

  return {
    json,
    leaderboard,
  }
}) satisfies PageServerLoad
