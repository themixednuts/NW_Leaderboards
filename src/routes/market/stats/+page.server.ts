import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {

    const test = `
    EXPLAIN QUERY PLAN
    WITH CTE AS (
      SELECT o.*, COALESCE (weapon.IconPath, armor.IconPath, instruments.IconPath, master.IconPath) AS iconPath, locale.text
      FROM orders o
      LEFT JOIN MasterItemDefinitions AS master ON master.ItemID = o.itemKey COLLATE NOCASE
      LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
      LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
      LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
      LEFT JOIN locale_en_us as locale ON locale.key = SUBSTR(master.Name, 2) COLLATE NOCASE
      WHERE o.sessionDate IN (SELECT sessionDate FROM server_metadata)
      AND contractType = 1
    )

   
    SELECT 'Highest Price' AS category, itemKey AS id, text AS name, MAX(price) / 100 AS value, perks, gearScore, iconPath, rarity, server   
    FROM CTE
    GROUP BY server

    UNION ALL

    SELECT 'Most Quantity' AS category, itemKey AS id, text AS name, SUM(quantity) AS value, perks, gearScore, iconPath, rarity, server
    FROM CTE
    GROUP BY server

    -- UNION ALL

    -- SELECT 'Most Uniquely Listed Item' AS category, 
    --        itemKey AS id, 
    --        text AS name,
    --        MAX(item_count) AS value,
    --        perks,
    --        gearScore,
    --        iconPath,
    --        rarity
    -- FROM (
    --     SELECT itemKey, text, COUNT(*) AS item_count, perks, gearScore, iconPath , rarity
    --     FROM CTE
    --     GROUP BY itemKey
    -- ) AS item_counts

    --UNION ALL

    --SELECT 'Trading Post With Most Listings' AS category, NULL AS id, location AS name, COUNT(*) AS value, NULL AS perks, NULL AS gearScore, NULL AS iconPath, NULL rarity, server
    --FROM CTE
    --GROUP BY server
    `
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

    const itemResults = []
    const categoryPerServer_query: string[] = []
    const normalizedServerList = servers.servers.sort()
    for (const server of normalizedServerList) {
        const query = `
        SELECT
        '${server}' AS server,
        TradingCategory,
        SUM(buy_count) AS count
        FROM ${server}_trading_count
        GROUP BY TradingCategory
        `
        categoryPerServer_query.push(query)
        // itemResults.push({sql: test, args: {server}})
    }
    const combined_category_query = categoryPerServer_query.join(' UNION ALL ')


    let startTime = performance.now()
    const results = db.batch([marketcap_query, combined_category_query], 'read')
    // const items = await db.execute(test)
    // console.log(items.rows)
    console.log('db timer - Market Cap Per Server: ', performance.now() - startTime, 'ms')

    startTime = performance.now()
    // const test_result = await db.execute(test)
    console.log(performance.now() - startTime)
    // console.log(test_result.rows)

    // const server_promise = Promise.all(servers.servers.map(server => fetch(`/market/api/items/${server.toLowerCase()}`).then((res) => res.json())))

    return {
        streamed: {
            items: results.then(res => ({
                marketcaps: res[0].rows,
                catergoryVolume: res[1].rows as unknown as { TradingCategory: string, count: number, server: string }[],
                // categories: server_promise

            })),
            // stats: items.then(res => res.map(row => row.rows) as any[])
        },
        servers: servers.servers,
    };
}) satisfies PageServerLoad;