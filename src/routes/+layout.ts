import {
  leaderboardIdMap,
  leaderboardMap,
  type LeaderboardDefinition,
} from '$lib/leaderboardmap'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load = (async ({route, fetch, params }) => {
  const validSeasons = ['q1', 's1', 's2']
  const currentSeason = validSeasons.includes(params.season || '') ? params.season || validSeasons.at(-1) : validSeasons.at(-1)

  if(route.id === '/') throw redirect(301,'/lb')

  let filter = 'CharacterLeaderboard' as
    | 'CharacterLeaderboard'
    | 'CompanyLeaderboard'
    | 'FactionLeaderboard'


  if (params.leaderboardId) {
    const map = leaderboardIdMap[params.leaderboardId as keyof typeof leaderboardIdMap]
    if (map) {
      const leaderboard: LeaderboardDefinition = leaderboardMap[map.FirstLevelCategory as keyof typeof leaderboardMap][map.Category as keyof typeof leaderboardMap[keyof typeof leaderboardMap]][
        map.SecondLevelCategory
      ].find((item: LeaderboardDefinition) => item.LeaderboardDefinitionId === params.leaderboardId)

      if (leaderboard?.CharacterLeaderboard === true) {
        filter = 'CharacterLeaderboard'
      }
      if (leaderboard?.CompanyLeaderboard === true) {
        filter = 'CompanyLeaderboard'
      }
    }
  }

  async function getUniqueUserData() {
    const allUsersResponse = await fetch(`https://lb.jakel.rocks/users?filter=all`)
    const currentUsersResponse = await fetch(`https://lb.jakel.rocks/users?filter=${validSeasons.at(-1)}`)
    const lastUsersResponse = await fetch(`https://lb.jakel.rocks/users?filter=${validSeasons.at(-2)}`)

    if (allUsersResponse.status !== 200) {
      throw new Error('Unique users not found')
    }

    const allUsers: LeaderboardAPIUserResponse = await allUsersResponse.json()
    const currentUsers: LeaderboardAPIUserResponse = await currentUsersResponse.json()
    const lastUsers: LeaderboardAPIUserResponse = await lastUsersResponse.json()
    const data = {
      all: allUsers,
      current: currentUsers,
      last: lastUsers
    }

    return data
  }

  async function getLegendaryData() {
    const response = await fetch(
      `https://lb.jakel.rocks/legendaries/${currentSeason}`
    )

    if (response.status !== 200) {
      throw new Error('Legendary data not found')
    }
    const data: LeaderboardAPILegendaryResponse = await response.json()

    return data
  }

  async function getBreachesData() {
    const response = await fetch(
      `https://lb.jakel.rocks/breaches/${currentSeason}`
    )

    if (response.status !== 200) {
      throw new Error('Breaches data not found')
    }
    const data: LeaderboardAPIBreachesResponse = await response.json()

    return data
  }

  return {
    users: await getUniqueUserData(),
    legendaries: await getLegendaryData(),
    breaches: await getBreachesData(),
    currentSeason,
    filter,
  }
}) satisfies LayoutLoad
