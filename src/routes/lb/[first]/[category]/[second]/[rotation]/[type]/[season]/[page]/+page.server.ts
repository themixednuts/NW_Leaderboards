import { match_leaderboard, type LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getCharacterById, getCompanyById, searchCompaniesAndCharactersByName } from '@/server/db/gamedata/helpers'

export const load = (async ({ locals, fetch, url, params: { season, type, first, second, category, rotation, page }, parent, url: { searchParams } }) => {
  const session = await locals.auth()
  const { leaderboards } = await parent()

  const displayName = searchParams.get('q')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')

  const pageSize = 10
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

  const start = (Number(page) - 1) * pageSize
  const end = Number(page) * pageSize

  const api = `/lb/api/leaderboard/${id}/${season}/${page}`
  const json = fetch(api)
    .then(res => res.json() as Promise<LeaderboardAPIBoardItem[]>)
    .then(data => {
      let rank = 2
      let currentRank = 2
      const mapped = data.map((entry, idx, arr) => {
        if (idx === 0) return entry
        if (arr[idx - 1].value !== arr[idx].value) {
          rank = currentRank
        }
        currentRank++
        return {
          ...entry,
          rank
        }
      })
      return mapped
    })
    .then(async (items) => {
      if (!search) return items
      const res = await searchCompaniesAndCharactersByName(search, session?.user, 30)
      return items.filter(entry => res.some(q => entry.entityId?.split('_').includes(q.id)))
    })
    .then(items => ({
      data: items.slice(start, end).map(entry => {
        if (type === 'character' && entry.entityId) return {
          ...entry,
          entityId: entry.entityId.split('_').map(id => getCharacterById(id, session?.user).then(character => ({ ...character, type: 'character' }))),
        }
        if (type === 'company' && entry.entityId) return {
          ...entry,
          entityId: entry.entityId.split('_').map(id => getCompanyById(id.replace(/\{|\}/g, ''), session?.user).then(company => ({ ...company, type: 'company' }))),
        }
      }), total: Math.ceil(items.length / pageSize)
    }))

  // const api = `https://api.nwlb.info/json/${id}/${season}?size=10000&eid=true`
  // const json = fetch(api)
  // .then(res => res.json() as Promise<LeaderboardAPIBoardItem[]>)
  //   .then(data => {
  //     let rank = 2
  //     let currentRank = 2
  //     const mapped = data.map((entry, idx, arr) => {
  //       if (idx === 0) return entry
  //       if (arr[idx - 1].value !== arr[idx].value) {
  //         rank = currentRank
  //       }
  //       currentRank++
  //       return {
  //         ...entry,
  //         rank
  //       }
  //     })
  //     return mapped
  //   })
  //   .then(async (items) => {
  //     if (!search) return items
  //     const res = await searchCompaniesAndCharactersByName(search, session?.user, 30)
  //     return items.filter(entry => res.some(q => entry.entityId?.split('_').includes(q.id)))
  //   })
  //   .then(items => ({
  //     data: items.slice(start, end).map(entry => {
  //       if (type === 'character' && entry.entityId) return {
  //         ...entry,
  //         entityId: entry.entityId.split('_').map(id => getCharacterById(id, session?.user).then(character => ({ ...character, type: 'character' }))),
  //       }
  //       if (type === 'company' && entry.entityId) return {
  //         ...entry,
  //         entityId: entry.entityId.split('_').map(id => getCompanyById(id.replace(/\{|\}/g, ''), session?.user).then(company => ({ ...company, type: 'company' }))),
  //       }
  //     }), total: Math.ceil(items.length / pageSize)
  //   }))

  // json.catch((e) => {
  //   console.log(e)
  // })

  return {
    json,
    leaderboard,
  }
}) satisfies PageServerLoad
