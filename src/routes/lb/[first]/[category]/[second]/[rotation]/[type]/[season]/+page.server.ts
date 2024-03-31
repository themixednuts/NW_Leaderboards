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
  const { lbs } = await parent()
  const displayName = searchParams.get('q')
  const lb = (await lbs).leaderboards.find(lb => match_leaderboard(lb, {
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
  const id = type === 'faction' ? lb?.FactionLeaderboardDefinitionId : lb?.LeaderboardDefinitionId

  const json = fetch(`https://api.nwlb.info/json/${id}/${season}?size=1000&eid=true`).then(async (res) => {
    if (!res.ok) error(res.status)
    const json = res.json() as Promise<LeaderboardAPIBoardItem[]>
    return json
  })
  json.catch((e) => { })

  return {
    json
  }
}) satisfies PageServerLoad
