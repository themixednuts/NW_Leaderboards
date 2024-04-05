import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { LeaderboardAPIBoardItem } from "@/leaderboard/utils"
import type { Config } from "@sveltejs/adapter-vercel"
import { BYPASS_TOKEN } from "$env/static/private"

export const config = {
  isr: {
    expiration: 1500,
    bypassToken: BYPASS_TOKEN
  },
} satisfies Config

export const GET = (async ({ request, params: { id, season, page }, url, fetch }) => {
  console.log('server.ts', request.headers, url)
  const api = `https://api.nwlb.info/json/${id}/${season}?size=100000&eid=true`
  const data = fetch(api).then(async (res) => {
    if (!res.ok) return error(res.status)
    const json = res.json() as Promise<LeaderboardAPIBoardItem[]>
    return json
  })

  data.catch((e) => {
    console.log(e)
  })

  return json(await data)
}) satisfies RequestHandler
