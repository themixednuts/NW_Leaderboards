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
    runtime: 'edge'
    // isr: {
    //     expiration: 3600,
    //     allowQuery: ['family', 'group', 'item', 'sort', 'price_min', 'price_max', 'gearscore_min', 'gearscore_max', 'perks']
    // },
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

export const load = (async ({ params: { server, category, page, type }, url: { searchParams }, setHeaders }) => {

    setHeaders({
        'cache-control': "max-age=60"
    })
    const family = searchParams.get('family')?.toLowerCase() || 'all'
    const group = searchParams.get('group')?.toLowerCase() || 'all'
    const sort = (searchParams.get('sort')?.toLowerCase()) as SortBy
    const item = searchParams.get('item') || 'all'
    const price_minParam = searchParams.get('price_min')
    const price_min = price_minParam
        ? (+price_minParam * 100)
        : 'all'
    const price_maxParam = searchParams.get('price_max')
    const price_max = price_maxParam
        ? (+price_maxParam * 100)
        : 'all'
    const gearscore_min = searchParams.get('gearscore_min') || 'all'
    const gearscore_max = searchParams.get('gearscore_max') || 'all'
    const perks = searchParams.get('perks') || ''

    let query = MarketBrowserQuery()
    const args = {
        category: category,
        family,
        group,
        item,
        page,
        server,
        type: browserType[type as keyof typeof browserType],
        price_max,
        price_min,
        gearscore_max,
        gearscore_min,
        perks
    }

    if (sort) {
        let sorted = SORT_MAP[sort as keyof typeof SORT_MAP]
        query = MarketBrowserQuery(`ORDER BY ${sorted}`)
    }

    console.log(args, SORT_MAP[sort as keyof typeof SORT_MAP])

    let countQuery
    const countArgs: { category?: string, family?: string, item?: string, server?: string, group?: string, type?: number, price_min?: string, price_max?: string, gearscore_min?: string, gearscore_max?: string } = {}

    if (item !== 'all') {
        countQuery = `
        SELECT COUNT(*) AS count
        FROM orders
        WHERE server = :server
        AND contractType = :type
        AND sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server) 
        AND 
            CASE
                WHEN :item = 'all' THEN 1
                ELSE itemKey = :item
            END
        `
        countArgs.item = item
        countArgs.server = server
        countArgs.type = browserType[type as keyof typeof browserType]
    } else {
        countQuery = `
    SELECT
    SUM(${type}_count) AS count
    FROM ${server}_trading_count
    WHERE 
        CASE
            WHEN :category = 'all' THEN 1
            ELSE TradingCategory = :category COLLATE NOCASE 
        END
    AND
        CASE 
            WHEN :family = 'all' THEN 1
            ELSE TradingFamily = :family COLLATE NOCASE
        END
    AND
        CASE
            WHEN :group = 'all' THEN 1
            ELSE TradingGroup = :group COLLATE NOCASE
        END
    `

        countArgs.category = category
        countArgs.family = family
        countArgs.group = group
    }
    const sessionDateQuery = `
    SELECT
    sessionDate
    FROM server_metadata
    WHERE server = :server
    `

    const startTime = performance.now()
    const result = db.batch([
        {
            sql: query,
            args
        },
        {
            sql: countQuery,
            args: countArgs
        },
        {
            sql: sessionDateQuery,
            args: {
                server
            }
        }
    ], 'read')
    console.log("db timer: ", performance.now() - startTime, " ms")

    // const marketdata_copy: MarketData[] = []
    // marketdata.rows.forEach((row) => {
    //     const obj = structuredClone(row) as unknown as MarketData
    //     //@ts-expect-error
    //     const arr = JSON.parse(obj.perks)
    //     obj.perks = arr
    //     marketdata_copy.push(obj)
    // })
    // const paginated: Paginated = {
    //     data: marketdata_copy as unknown as MarketData[],
    //     //@ts-expect-error
    //     end: Math.ceil(+count.rows[0].count / 20) || 1,
    //     sessionDate: sessionDate.rows[0].sessionDate as unknown as string
    // }

    return {
        streamed: {
            marketdata: result.then(res => ({
                data: res[0].rows.map(marketdata => ({ ...marketdata, perks: JSON.parse(marketdata.perks as string) } as unknown as MarketData)),
                end: Math.ceil((res[1].rows[0].count as number) / 20) || 1,
                sessionDate: res[2].rows[0].sessionDate as unknown as string
            }))

        }
    };

}) satisfies PageServerLoad;