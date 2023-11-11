import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { perk }, url: { searchParams }, setHeaders }) => {

    setHeaders({
        'cache-control': "max-age=9000"
    })

    const isGem = searchParams.get('gem') || ''

    const query = `
    --explain query plan
    SELECT PerkID as id, locale.text as name, PerkType as type, IconPath
    FROM ItemPerks
    INNER JOIN locale_en_us AS locale ON locale.key = SUBSTR(DisplayName, 2) COLLATE NOCASE AND locale.text LIKE '%' || :perk || '%' COLLATE NOCASE
    WHERE
        CASE 
            WHEN :isGem = 'false' THEN PerkType IS NOT 'Gem'
            WHEN :isGem = 'true' THEN PerkType = 'Gem'
            ELSE 1
        END
    `
    let startTime = performance.now()
    const res = await db.execute({
        sql: query,
        args: {
            perk,
            isGem
        }
    })
    console.log('db timer - Perk Search: ', performance.now() - startTime, ' ms')
    // console.log(res.rows)
    return json(res.rows);
};