import type { RequestHandler } from './$types'
import { db } from '$lib/server/db/users/client'
import { error, json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ setHeaders }) => {

    setHeaders({
        'cache-control': "public,s-maxage=9000"
    })

    let result
    let startTime = performance.now()
    try {
        // result = await db.selectDistinct().from()
    }
    catch (e) {
        console.log(e)
        error(500, "Incorrect Request")
    }
    console.log('db timer - Servers: ', performance.now() - startTime, ' ms')

    //@ts-expect-error
    return json({ servers: result.rows.map(row => row.server) })
}
// --EXPLAIN QUERY PLAN
//     SELECT DISTINCT server
//     FROM events
//     `