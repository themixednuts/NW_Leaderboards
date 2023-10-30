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
    // isr: {
    //     expiration: 5200,
    //     allowQuery: ['family', 'group', 'item', 'sort']
    // },
    runtime: 'edge',
}

type SortBy = "price_asc" | "price_desc" | "name_asc" | "name_desc" | "tier_asc" | "tier_desc" | "gs_asc" | "gs_desc" | "perks_asc" | "perks_desc" | "avail_asc" | "avail_desc" | "gem_asc" | "gem_desc" | "exp_asc" | "exp_desc"
const SORT_MAP: { [k in SortBy]: string } = {
    "price_asc": 'price',
    "price_desc": 'price DESC',
    "name_asc": 'name',
    "name_desc": 'name DESC',
    "gs_asc": 'gearScore',
    "gs_desc": 'gearScore DESC',
    "perks_asc": 'perkCount',
    "perks_desc": 'perkCount DESC',
    "avail_asc": 'quantity',
    "avail_desc": 'quantity DESC',
    "tier_asc": 'tier',
    "tier_desc": 'tier DESC',
    "gem_asc": 'gemPerkCount',
    "gem_desc": 'gemPerkCount DESC',
    "exp_asc": 'expirationSec',
    "exp_desc": 'expirationSec DESC',
}

export const load = (async ({ params: { server, category, page, type }, url: { searchParams } }) => {
    const family = searchParams.get('family')?.toLowerCase()
    const group = searchParams.get('group')?.toLowerCase()
    const sort = (searchParams.get('sort')?.toLowerCase() || "") as SortBy

    let query = MarketBrowserQuery()
    let startTime = performance.now()
    const args = {
        category: category,
        family: family || 'all',
        group: group || 'all',
        page,
        server,
        type: browserType[type as keyof typeof browserType],
    }
    if(sort){
        //@ts-expect-error
        args.sort = SORT_MAP[sort as keyof typeof SORT_MAP][0]
        query = MarketBrowserQuery('ORDER BY :sort')
        
    }
    const marketdata = await db.execute({
        sql: query,
        args
    })
    console.log("db timer - MarketData: ", performance.now() - startTime, " ms")

    // console.log(marketdata.rows)
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
    SUM(${type}_count) AS count
    FROM ${server}_trading_count
    WHERE (:category = 'all' OR TradingCategory = :category COLLATE NOCASE) AND
         (:family IS NULL OR TradingFamily = :family COLLATE NOCASE) AND
         (:group IS NULL OR TradingGroup = :group COLLATE NOCASE)
    `
    startTime = performance.now()
    const count = await db.execute({
        sql: countQuery,
        args: {
            category,
            family: family || null,
            group: group || null
        }
    })
    console.log("db timer - TradingCount: ", performance.now() - startTime, " ms")

    startTime = performance.now()
    const sessionDateQuery = `
    SELECT
    sessionDate
    FROM server_metadata
    WHERE server = :server
    `
    const sessionDate = await db.execute({
        sql: sessionDateQuery,
        args: {
            server
        }
    })
    console.log("db timer - SessionData: ", performance.now() - startTime, " ms")

    const paginated: Paginated = {
        data: marketdata_copy as unknown as MarketData[],
        //@ts-expect-error
        end: Math.ceil(+count.rows[0].count / 20) || 1,
        sessionDate: sessionDate.rows[0].sessionDate as unknown as string
    }

    return {
        marketdata: paginated
    };

}) satisfies PageServerLoad;