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

    const updatedRows = eventdata.rows.map((row) => {
        // Assuming row.defenderCrestData is a string
        const defCrestData = row.defenderCrestData as string;
        const attkCrestData = row.attackerCrestData as string;
        return {
            ...row,
            defenderCrestData: defCrestData ? JSON.parse(defCrestData) : defCrestData,
            attackerCrestData: attkCrestData ? JSON.parse(attkCrestData) : attkCrestData
        };
    });
    // console.log(updatedRows)
    return json(updatedRows)
};