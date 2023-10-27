import type { MarketData } from '$lib/market.types';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { Config } from '@sveltejs/adapter-vercel';
import { MarketBrowserQuery } from '$lib/utils';

type Paginated = {
    data: MarketData[],
    end: number,
    sessionDate: string,
}

const browserType = {
    sell: 0,
    buy: 1,
}
export const config: Config = {
    isr: {
        expiration: 10,
        allowQuery: ['family', 'group', 'item', 'sort']
    },
    runtime: 'nodejs18.x',
}

type SortBy = "price_asc" | "price_desc" | "name_asc" | "name_desc" | "tier_asc" | "tier_desc" | "gs_asc" | "gs_desc" | "perks_asc" | "perks_desc" | "avail_asc" | "avail_desc" | "gem_asc" | "gem_desc" | "exp_asc" | "exp_desc" | ""
const SORT_MAP: { [k in SortBy]: string } = {
    "price_asc": 'ORDER BY price',
    "price_desc": 'ORDER BY price DESC',
    "name_asc": 'ORDER BY name',
    "name_desc": 'ORDER BY name DESC',
    "gs_asc": 'ORDER BY gearScore',
    "gs_desc": 'ORDER BY gearScore DESC',
    "perks_asc": 'ORDER BY perkCount',
    "perks_desc": 'ORDER BY perkCount DESC',
    "avail_asc": 'ORDER BY quantity',
    "avail_desc": 'ORDER BY quantity DESC',
    "tier_asc": 'ORDER BY tier',
    "tier_desc": 'ORDER BY tier DESC',
    "gem_asc": 'ORDER BY gemPerkCount',
    "gem_desc": 'ORDER BY gemPerkCount DESC',
    "exp_asc": 'ORDER BY expirationSec',
    "exp_desc": 'ORDER BY expirationSec DESC',
    "": '',
}

export const load = (async ({ params: { server, category, page, type }, url: { searchParams }, fetch }) => {
    const server_lowercase = server.toLowerCase()
    const family = searchParams.get('family')?.toLowerCase()
    const group = searchParams.get('group')?.toLowerCase()
    const sort = (searchParams.get('sort')?.toLowerCase() || "") as SortBy

    const query = MarketBrowserQuery(server, browserType[type as keyof typeof browserType], SORT_MAP[sort])

    const start = performance.now()

    const marketdata = await db.execute({
        sql: query,
        args: {
            category: category,
            family: family || 'all',
            group: group || 'all',
            // server: server_lowercase,
            page
        }
    })
    
    console.log(performance.now() - start, " ms")

    const marketdata_copy: MarketData[] = []
    marketdata.rows.forEach((row) => {
        const obj = structuredClone(row) as unknown as MarketData
        //@ts-expect-error
        const arr = JSON.parse(obj.perks)
        obj.perks = arr
        marketdata_copy.push(obj)
    })

    const countQuery = `
    SELECT
    lastSessionCount AS totalCount,
    lastSessionDate AS sessionDate
    FROM server_metadata
    WHERE name = :server`

    const servermeta = await db.execute({
        sql: countQuery,
        args: {
            server: server_lowercase,
        }
    })
    const totalPages = Math.ceil(servermeta.rows[0]['totalCount'] as number / 20)
    const sessionDate = servermeta.rows[0]['sessionDate']

    const paginated: Paginated = {
        data: marketdata_copy as unknown as MarketData[],
        end: totalPages || 1,
        sessionDate: sessionDate as string
    }

    return {
        marketdata: paginated
    };

}) satisfies PageServerLoad;