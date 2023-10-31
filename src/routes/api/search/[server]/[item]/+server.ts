import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { server, item } }) => {

    const query = `
    SELECT DISTINCT itemKey as id, locale.text as name, master.TradingCategory, master.TradingFamily, master.TradingGroup
    FROM orders   
    LEFT JOIN MasterItemDefinitions AS master ON itemKey = master.ItemID COLLATE NOCASE
    LEFT JOIN locale_en_us AS locale ON SUBSTR(master.Name, 2) = locale.key COLLATE NOCASE
    WHERE locale.text LIKE '%' || :item || '%' COLLATE NOCASE
    AND server = :server
    AND sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server);
    `

    const res = await db.execute({
        sql: query,
        args: {
            item,
            server
        }
    })

    return json(res.rows);
};