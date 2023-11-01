import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import type { Config } from '@sveltejs/adapter-vercel';
import { error, json } from '@sveltejs/kit';

export const config: Config = {
    isr: {
        expiration: 14400
    },
    runtime: 'nodejs18.x'
}
export const GET: RequestHandler = async () => {
    let result
    try {
    result = await db.execute(`
    SELECT DISTINCT server
    FROM orders
    `)
    } catch(e){
        console.log(e)
        throw error(500, "Incorrect Request")
    }

    return json({ servers: result.rows.map(row => row.server) })
};