import {
  leaderboardIdMap,
  leaderboardMap,
  type LeaderboardIdMap,
  type LeaderboardType,
} from '$lib/leaderboardmap'
import type { LayoutLoad } from './$types'

export const load = (async ({ fetch, params }) => {
  const currentSeason = params.season || 's2'
  const lastSeason = currentSeason === 's1' ? 'q1' : 's' + (parseInt(currentSeason.slice(1)) - 1)
  let filter = 'CharacterLeaderboard' as
    | 'CharacterLeaderboard'
    | 'CompanyLeaderboard'
    | 'FactionLeaderboard'

  const leaderboardMapId: LeaderboardIdMap = leaderboardIdMap
  const leaderboardData: LeaderboardType = leaderboardMap

  if (params.leaderboardId) {
    const map = leaderboardMapId[params.leaderboardId]
    if (map) {
      const leaderboard = leaderboardData[map.FirstLevelCategory][map.Category][
        map.SecondLevelCategory
      ].find((item) => item.LeaderboardDefinitionId === params.leaderboardId)

      if (leaderboard?.CharacterLeaderboard === true) {
        filter = 'CharacterLeaderboard'
      }
      if (leaderboard?.CompanyLeaderboard === true) {
        filter = 'CompanyLeaderboard'
      }
    }

    // if (leaderboard?.FactionLeaderboard === true) {
    //   filter = 'FactionLeaderboard'
    // }
  }

  async function getUniqueUserData() {
    const allUsersResponse = await fetch(`https://lb.jakel.rocks/users?filter=all`)
    const currentUsersResponse = await fetch(`https://lb.jakel.rocks/users?filter=${currentSeason}`)
    const lastUsersResponse = await fetch(`https://lb.jakel.rocks/users?filter=${lastSeason}`)

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
