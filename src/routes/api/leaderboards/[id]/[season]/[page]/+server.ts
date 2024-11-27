import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { LeaderboardAPIBoardItem } from '@/leaderboard/utils'
import type { Config } from '@sveltejs/adapter-vercel'
import { BYPASS_TOKEN } from '$env/static/private'

export const config = {
  isr: {
    expiration: 1500,
    bypassToken: BYPASS_TOKEN,
  },
} satisfies Config

export const GET = (async ({ params: { id, season, page }, fetch }) => {
  const api = `https://api.nwlb.info/json/${id}/${season}?size=100000&eid=true`
  const res = await fetch(api)
  const data: LeaderboardAPIBoardItem[] = await res.json()
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
      rank,
    }
  })
  return json(mapped)
}) satisfies RequestHandler
