import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ setHeaders }) => {

    setHeaders({
        'cache-control': "public,s-maxage=9000"
    })

    let result
    let startTime = performance.now()
    try {
        result = await db.execute(`
    -- EXPLAIN QUERY PLAN
    SELECT DISTINCT server
    FROM events
    `)
    } catch (e) {
        console.log(e)
        throw error(500, "Incorrect Request")
    }
    console.log('db timer - Servers: ', performance.now() - startTime, ' ms')
    // console.log(result.rows)

    return json({ servers: result.rows.map(row => row.server) })
};