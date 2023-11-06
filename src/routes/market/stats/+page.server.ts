import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
}
export const load = (async ({fetch}) => {

    
    const serverReq = await fetch('/market/api/servers')
    const servers = await serverReq.json()
    
    const query = `
    -- EXPLAIN QUERY PLAN
    SELECT s.server, SUM(o.price / 100 * o.quantity) AS market_cap, SUM(o.quantity) AS quantity
    FROM orders as o
    INNER JOIN server_metadata as s ON s.sessionDate = o.sessionDate
    WHERE o.contractType = 1
    GROUP BY s.server;
    `
    let startTime = performance.now()
    const result = await db.execute(query)
    
    // console.log(result.rows)
    console.log('db timer - Market Cap Per Server: ', performance.now() - startTime, 'ms')

    const categoryPerServer_query: string[] = []
    const normalizedServerList = servers.servers.sort()
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
        catergoryVolume: res.rows,
        servers: servers.servers
    };
}) satisfies PageServerLoad;