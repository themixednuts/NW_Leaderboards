import { LEADERBOARD_ID_MAP, LEADERBOARD_DATA, type LeaderboardDefinition } from '$lib/leaderboard/leaderboardmap'
import { error, redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load = (async ({ route, params }) => {

  const validSeasons = ['q1', 's1', 's2', 's3']
  const currentSeason = validSeasons.includes(params.season || '')
    ? params.season || validSeasons.at(-1)
    : validSeasons.at(-1)

  //@ts-expect-error
  if (route.id === '/') throw redirect(301, '/lb')

  let filter = 'CharacterLeaderboard' as 'CharacterLeaderboard' | 'CompanyLeaderboard' | 'FactionLeaderboard'

  const { lbid } = params

  if (lbid && !(lbid in LEADERBOARD_ID_MAP)) throw error(404)

  if (lbid) {
    const { FirstLevelCategory, Category, SecondLevelCategory } =
      LEADERBOARD_ID_MAP[lbid as keyof typeof LEADERBOARD_ID_MAP]
    //@ts-expect-error
    const leaderboard: LeaderboardDefinition = LEADERBOARD_DATA[FirstLevelCategory][Category][SecondLevelCategory].find(
      (item: LeaderboardDefinition) => item.LeaderboardDefinitionId === lbid,
    )
    if (leaderboard?.CharacterLeaderboard === true) filter = 'CharacterLeaderboard'
    if (leaderboard?.CompanyLeaderboard === true) filter = 'CompanyLeaderboard'
  }

  // const all = fetch(`https://lb.jakel.rocks/users?filter=all`).then(res => res.json() as Promise<LeaderboardAPIUserResponse>)
  // const current = fetch(`https://lb.jakel.rocks/users?filter=${validSeasons.at(-1)}`).then(res => res.json() as Promise<LeaderboardAPIUserResponse>)
  // const last = fetch(`https://lb.jakel.rocks/users?filter=${validSeasons.at(-2)}`).then(res => res.json() as Promise<LeaderboardAPIUserResponse>)
  // const legendaries = fetch(`https://lb.jakel.rocks/legendaries/${currentSeason}`).then(res => res.json() as Promise<LeaderboardAPILegendaryResponse>)
  // const breaches = fetch(`https://lb.jakel.rocks/breaches/${currentSeason}`).then(res => res.json() as Promise<LeaderboardAPIBreachesResponse>)

  // const promise = async () => {
  //   return {
  //     all: await all,
  //     current: await current,
  //     last: await last
  //   }
  // }

  return {
    // users: promise(),
    // legendaries,
    // breaches,
    currentSeason,
    filter,
  }
}) satisfies LayoutLoad
