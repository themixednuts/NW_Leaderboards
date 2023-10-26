import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({params: {id}}) => {
    const query = `
    SELECT 
    locale.name
    FROM MasterItemDefinitions 
    LEFT JOIN masteritems_en_us AS locale ON locale.key = Name COLLATE NOCASE
    WHERE ItemID = :id COLLATE NOCASE`
    const searchResults = await db.execute({
        sql: query,
        args: {
            id
        }
    })
    return new Response();
};