import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { item } }) => {

    const query = `
    SELECT ItemID as id, locale.text as name, TradingCategory, TradingFamily, TradingGroup
    FROM MasterItemDefinitions AS master ON itemKey = master.ItemID COLLATE NOCASE
    LEFT JOIN locale_en_us AS locale ON SUBSTR(master.Name, 2) = locale.key COLLATE NOCASE
    WHERE locale.text LIKE '%' || :item || '%' COLLATE NOCASE
    AND TradingCategory IS NOT ''
    `

    const res = await db.execute({
        sql: query,
        args: {
            item,
        }
    })

    return json(res.rows);
};