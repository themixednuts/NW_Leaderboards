import { match_leaderboard, type LeaderboardAPIBoardItem } from '$lib/leaderboard/utils'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {
  getCharacterById,
  getCharactersByIds,
  getCompaniesByIds,
  getCompanyById,
  searchCompaniesAndCharactersByName,
} from '@/server/db/gamedata/helpers'
import type { Session } from '@auth/sveltekit'
import { db } from '@/server/db/gamedata/client'

const SORT_BY = {
  rank: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.rank - b.rank,
  rank_desc: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.rank - a.rank,
  // 'entity': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.entityId,
  // 'entity_desc': (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => { },
  value: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.value - b.value,
  value_desc: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.value - a.value,
  server: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => a.server.localeCompare(b.server),
  server_desc: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.server.localeCompare(a.server),
  faction: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) => b.faction?.localeCompare(a.faction ?? '') || 0,
  faction_desc: (a: LeaderboardAPIBoardItem, b: LeaderboardAPIBoardItem) =>
    a.faction?.localeCompare(b.faction ?? '') || 0,
}

function isSortBy(key: string): key is keyof typeof SORT_BY {
  return key in SORT_BY
}

export const load = (async ({
  locals,
  fetch,
  url,
  params: { season, type, first, second, category, rotation, page },
  parent,
  url: { searchParams },
}) => {
  const { leaderboards } = await parent()

  const displayName = searchParams.get('q')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')

  const leaderboard = leaderboards.find((lb) =>
    match_leaderboard(lb, {
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
    }),
  )

  if (!leaderboard) {
    console.log('No leaderboard found')

    return error(400, `This category is not tracked by ${type}`)
  }

  const id = type === 'faction' ? leaderboard.FactionLeaderboardDefinitionId : leaderboard.LeaderboardDefinitionId
  if (!id) {
    console.log('No leaderboard id found')
    return error(400, 'Leaderboard ID not found')
  }

  const session = await locals.auth()

  const pageSize = 10

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
  const request = fetch(api).then((res) => {
    return res.json() as Promise<LeaderboardAPIBoardItem[]>
  })

  request.catch((e) => console.log(e))

  const json = processLeaderboardReqeust(request, { sort, search, session, type, page, pageSize })

  json.catch((e) => {
    console.log(e)
  })

  return {
    json,
    leaderboard,
  }
}) satisfies PageServerLoad

type LeaderboardParams = {
  sort?: string | null
  search?: string | null
  type: string
  session: Session | null
  pageSize: number
  page: string
}

async function processLeaderboardReqeust(
  items: Promise<LeaderboardAPIBoardItem[]>,
  { sort, search, type, session, page, pageSize }: LeaderboardParams,
) {
  const allRanked = rankLeaderboardResults(await items)
  let allSorted = sort && isSortBy(sort) ? allRanked.sort(SORT_BY[sort]) : allRanked

  if (search && type !== 'faction') {
    const res = await searchCompaniesAndCharactersByName(search, session?.user, 30)
    allSorted = allSorted.filter((row) => row.entityId?.split('_').some((id) => res.map((q) => q.id).includes(id)))
  }

  const start = (Number(page) - 1) * pageSize
  const end = Number(page) * pageSize

  const allSliced = allSorted.slice(start, end)

  if (type === 'character') {
    const ids = new Set<string>()
    for (let i = 0; i < allSliced.length; i++) {
      const item = allSliced[i]
      if (!item.entityId) continue
      item.entityId.split('_').forEach((id) => ids.add(id))
    }

    const res = await Promise.all(ids.values().map((id) => getCharacterById(id, session?.user)))

    for (let i = 0; i < allSliced.length; i++) {
      const item = allSliced[i]
      if (!item.entityId) continue

      const ids = item.entityId.split('_')
      //@ts-expect-error
      item.entityId = res
        .filter((ele) => ele && ids.includes(ele.id))
        .map((ele) => {
          //@ts-expect-error
          if (ele) ele.type = 'character'
          return ele
        })
    }
  }

  if (type === 'company') {
    const ids = []
    for (let i = 0; i < allSliced.length; i++) {
      const item = allSliced[i]
      if (!item.entityId) continue
      ids.push(...item.entityId.replace(/\{|\}/g, '').split('_'))
    }

    const res = await Promise.all(ids.map((id) => getCompanyById(id, session?.user)))

    for (let i = 0; i < allSliced.length; i++) {
      const item = allSliced[i]
      if (!item.entityId) continue

      const ids = item.entityId.replace(/\{|\}/g, '').split('_')

      //@ts-expect-error
      allSliced[i] = res
        .filter((ele) => ele && ids.includes(ele.id))
        .map((ele) => {
          //@ts-expect-error
          if (ele) ele.type = 'company'
          return ele
        })
    }
  }

  return {
    data: allSliced,
    total: Math.ceil(allSorted.length / pageSize),
  }
}

function rankLeaderboardResults(data: LeaderboardAPIBoardItem[]) {
  let rank = 2
  let currentRank = 2

  return data?.map((entry, idx, arr) => {
    if (idx === 0) return entry
    if (arr[idx - 1].value !== arr[idx].value) {
      rank = currentRank
    }
    currentRank++
    return {
      ...entry,
      rank,
    }
  })
}
