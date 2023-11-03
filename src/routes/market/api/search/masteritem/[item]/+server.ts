import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { item } }) => {

    const query = `
    --explain query plan
    SELECT ItemID as id, locale.text as name, TradingCategory, TradingFamily, TradingGroup
    FROM MasterItemDefinitions
    INNER JOIN locale_en_us AS locale ON locale.key = SUBSTR(Name, 2) COLLATE NOCASE AND locale.text LIKE '%' || :item || '%' COLLATE NOCASE
    WHERE
    TradingCategory IS NOT ''
    `

    let startTime = performance.now()
    const res = await db.execute({
        sql: query,
        args: {
            item,
        }
    })
    console.log('db timer - Item Search: ', performance.now() - startTime, ' ms')
    // console.log(res.rows)
    return json(res.rows);
};