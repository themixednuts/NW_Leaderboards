import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, setHeaders }) => {
    
    setHeaders({
        'cache-control': "public,max-age=9000"
    })

    let serverReq
    try {
        serverReq = await fetch('/market/api/servers')
    } catch (e) {
        console.log(e)
        throw error(500)
    }
    const servers = await serverReq.json() as { servers: string[] }

    const marketcap_query = `
    -- EXPLAIN QUERY PLAN
    SELECT s.server, SUM(o.price / 100 * o.quantity) AS market_cap, SUM(o.quantity) AS quantity
    FROM orders as o
    INNER JOIN server_metadata as s ON s.sessionDate = o.sessionDate
    WHERE o.contractType = 1
    GROUP BY s.server;
    `

    const categoryPerServer_query: string[] = []
    const normalizedServerList = servers.servers.sort()
    for (const server of normalizedServerList) {
        let query = `
        SELECT
        '${server}' AS server,
        TradingCategory,
        SUM(buy_count) AS count
        FROM ${server}_trading_count
        GROUP BY TradingCategory
        `
        categoryPerServer_query.push(query)

    }
    const query = `
    SELECT
        CASE
            WHEN o.id = metadata.maxprice_id THEN 'price'
            WHEN o.id = metadata.maxquantity_id THEN 'quantity'
            WHEN o.id = metadata.mostlisted_id THEN 'unique'
            WHEN o.id = metadata.mostusedtp_id THEN 'tradingpost'
            ELSE NULL
        END AS category,
        CASE
            WHEN o.id = metadata.mostusedtp_id THEN null
            ELSE o.itemkey
        END AS id,
        CASE
            WHEN o.id = metadata.mostusedtp_id THEN o.location
            ELSE locale.text
        END AS name,
        CASE
            WHEN o.id = metadata.maxprice_id THEN metadata.maxprice_value / 100
            WHEN o.id = metadata.maxquantity_id THEN metadata.maxquantity_value
            WHEN o.id = metadata.mostusedtp_id THEN metadata.mostusedtp_value
            WHEN o.id = metadata.mostlisted_id THEN metadata.mostlisted_value
            ELSE NULL
        END AS value,
        CASE
            WHEN o.id = metadata.mostusedtp_id THEN null
            ELSE o.rarity
        END AS rarity,
        CASE
            WHEN o.id = metadata.mostusedtp_id THEN null
            ELSE o.gearScore
        END AS gearScore,
        CASE
            WHEN o.id = metadata.mostusedtp_id THEN null
            ELSE o.perks
        END AS perks,
        CASE
            WHEN o.id = metadata.mostusedtp_id THEN null
            ELSE COALESCE (weapon.IconPath, armor.IconPath, instruments.IconPath, master.IconPath)
        END AS iconPath,
        CASE
            WHEN o.id = metadata.maxquantity_id or o.id = metadata.mostlisted_id THEN
                CASE
                    WHEN metadata.maxquantity_id = metadata.mostlisted_id THEN metadata.mostlisted_value
                    ELSE NULL
                END
            ELSE NULL
        END as fallback,
        o.server
    FROM orders o
    INNER JOIN server_metadata as metadata ON metadata.sessionDate = o.sessionDate
    LEFT JOIN MasterItemDefinitions AS master ON master.ItemID = o.itemKey COLLATE NOCASE
    LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
    LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
    LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
    LEFT JOIN locale_en_us as locale ON locale.key = SUBSTR(master.Name, 2) COLLATE NOCASE
    WHERE o.id IN (metadata.maxprice_id, metadata.maxquantity_id, metadata.mostusedtp_id, metadata.mostlisted_id)
`

    const combined_category_query = categoryPerServer_query.join(' UNION ALL ')
    let startTime = performance.now()
    const stats = db.execute(query)
    const results = db.batch([marketcap_query, combined_category_query], 'read')
    console.log('db timer - Market Cap Per Server: ', performance.now() - startTime, 'ms')
    // console.log(test_result.rows)
    return {
        streamed: {
            items: results.then(res => ({
                marketcaps: res[0].rows,
                catergoryVolume: res[1].rows as unknown as { TradingCategory: string, count: number, server: string }[],
            })),
            stats: stats.then(res => res.rows as unknown as { id: string, price: number, iconPath: string, server: string, perks: string, category: 'price' | 'quantity' | 'unique' | 'tradingpost', name: string, gearScore: number, rarity: number, value: number, fallback: number | null }[])
        },
        servers: servers.servers,
    };
}) satisfies PageServerLoad;