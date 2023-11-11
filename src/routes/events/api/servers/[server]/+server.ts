import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { server }, setHeaders }) => {

    setHeaders({
        'cache-control': "public,s-maxage=9000"
    })

    const query = 'SELECT * FROM events WHERE server = :server'
    const eventdata = await db.execute({
        sql: query,
        args: {
            server
        }
    })
    return json(eventdata.rows)
};