import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { server }, setHeaders }) => {


    setHeaders({
        'cache-control': "public,s-maxage=9000"
    })

    const query = `
    --explain query plan
    SELECT itemKey as id, locale.text as name, MIN(price) as min_price, AVG(price) as avg_price, MAX(price) as max_price, SUM(quantity) as totalQuantity, sessionDate as updatedAt
    FROM orders
    INNER JOIN MasterItemDefinitions AS master ON itemKey = master.ItemID COLLATE NOCASE 
    INNER JOIN locale_en_us AS locale ON locale.key = SUBSTR(master.Name, 2) COLLATE NOCASE
    WHERE server = :server
    AND contractType = 1
    AND sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
    GROUP BY itemKey
    `

    let res
    let startTime = performance.now()
    try {
        res = await db.execute({
            sql: query,
            args: {
                server: server.toLowerCase()
            }
        })
        console.log('db timer - Item Search: ', performance.now() - startTime, ' ms')

    } catch (e) {
        console.log(e)
        throw error(500)
    }
    // console.log(res.rows)
    if (!res.rows.length) throw error(400, 'Bad Request')

    //@ts-ignore
    const results = res.rows.map(row => ({ ...row, max_price: parseInt(row.max_price) / 100, min_price: row.min_price / 100, avg_price: row.avg_price / 100 })) as unknown as { id: string, name: string, min_price: number, avg_price: number, max_price: number, updatedAt: string }[]

    const data = results.map(row => {
        const { updatedAt, ...rest } = row
        return { ...rest, min_price: row.min_price.toFixed(2), avg_price: row.avg_price.toFixed(2), max_price: row.max_price.toFixed(2) }
    })

    return json({
        server,
        updatedAt: res.rows[0].updatedAt,
        data,
    });
};