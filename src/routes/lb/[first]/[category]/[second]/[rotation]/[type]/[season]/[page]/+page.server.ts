import { match_leaderboard, type LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getCharacterById, getCompanyById, searchCompaniesAndCharactersByName } from '@/server/db/gamedata/helpers'

const SORT_BY = {
  'rank': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.rank - b.rank,
  'rank_desc': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.rank - a.rank,
  // 'entity': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.entityId,
  // 'entity_desc': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => { },
  'value': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.value - b.value,
  'value_desc': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.value - a.value,
  'server': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.server.localeCompare(b.server),
  'server_desc': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.server.localeCompare(a.server),
  'faction': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.faction?.localeCompare(a.faction ?? '') || 0,
  'faction_desc': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.faction?.localeCompare(b.faction ?? '') || 0
}

function isSortBy(key: string): key is keyof typeof SORT_BY {
  return key in SORT_BY
}

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

  // const api = `/lb/api/leaderboard/${id}/${season}/${page}`
  // const json = fetch(api, {
  //   headers: {
  //     'x-forwarded-host': url.host
  //   }
  // })
  //   .then(res => res.json() as Promise<LeaderboardAPIBoardItem[]>)
  //   .then(async (items) => {
  //     if (!search) return items
  //     const res = await searchCompaniesAndCharactersByName(search, session?.user)
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

  const api = `https://api.nwlb.info/json/${id}/${season}?size=10000&eid=true`
  const json = fetch(api).then(res => {
    if (res.ok) return res.json() as Promise<LeaderboardAPIBoardItem[]>
    error(res.status)
  })
    .then(data => {
      let rank = 2
      let currentRank = 2
      const mapped = data?.map((entry, idx, arr) => {
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
      if (sort && sort.length && isSortBy(sort)) mapped.sort(SORT_BY[sort])
      return mapped
    })
    .then(async (rows) => {
      if (!search || type === 'faction') return rows
      const res = await searchCompaniesAndCharactersByName(search, session?.user, 30)
      const found = rows
        .filter(row => row.entityId?.split('_').some(id => res.map(q => q.id).includes(id)))
      return found
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
        return entry
      }), total: Math.ceil(items.length / pageSize)
    }))

  json.catch((e) => {
    console.log(e)
  })

  return {
    json,
    leaderboard,
  }
}) satisfies PageServerLoad
