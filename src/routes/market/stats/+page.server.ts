import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { Config } from '@sveltejs/adapter-vercel';
import { serverList } from '$lib/utils';

export const config: Config = {
}
export const load = (async () => {

    const query = `
    SELECT s.server, SUM(o.price / 100 * o.quantity) AS market_cap, SUM(o.quantity) AS quantity
    FROM server_metadata s
    INNER JOIN orders o ON s.server = o.server AND s.sessionDate = o.sessionDate
    WHERE o.contractType = 1
    GROUP BY s.server;
    `
    let startTime = performance.now()
    const result = await db.execute(query)
    console.log('db timer - Market Cap Per Server: ', performance.now() - startTime, 'ms')

    const categoryPerServer_query: string[] = []
    const normalizedServerList = serverList.map(server => server.replaceAll(' ', '').toLowerCase())
    for (const server of normalizedServerList){
        const query = `
        SELECT
        '${server}' AS server,
        TradingCategory,
        SUM(buy_count) AS count
        FROM ${server}_trading_count
        GROUP BY TradingCategory
        `
        categoryPerServer_query.push(query)
    }
    const combined_query = categoryPerServer_query.join(' UNION ALL ')
    startTime = performance.now()
    const res = await db.execute(combined_query)
    console.log('db timer - TradingCount Per Server: ', performance.now() - startTime, 'ms')
    return {
        marketcaps: result.rows,
        catergoryVolume: res.rows
    };
}) satisfies PageServerLoad;