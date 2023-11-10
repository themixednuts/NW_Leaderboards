import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
    isr: null,
    runtime: 'edge'
}

export const GET: RequestHandler = async ({ params: { server }, setHeaders }) => {
    setHeaders({
        'cache-control': 'public,max-age=3600'
    })

    const query = `
    -- EXPLAIN QUERY PLAN
    WITH CTE AS (
      SELECT o.*, COALESCE (weapon.IconPath, armor.IconPath, instruments.IconPath, master.IconPath) AS iconPath, locale.text
      FROM orders o
      LEFT JOIN MasterItemDefinitions AS master ON master.ItemID = o.itemKey COLLATE NOCASE
      LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
      LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
      LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
      LEFT JOIN locale_en_us as locale ON locale.key = SUBSTR(master.Name, 2) COLLATE NOCASE
      WHERE o.sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
      AND contractType = 1
    )
   
    SELECT 'Highest Price' AS category, itemKey AS id, text AS name, MAX(price) / 100 AS value, perks, gearScore, iconPath, rarity   
    FROM CTE

    UNION ALL

    SELECT 'Most Quantity' AS category, itemKey AS id, text AS name, SUM(quantity) AS value, perks, gearScore, iconPath, rarity   
    FROM CTE

    -- UNION ALL

    -- SELECT 'Most Uniquely Listed Item' AS category, 
    --        itemKey AS id, 
    --        text AS name,
    --        MAX(item_count) AS value,
    --        perks,
    --        gearScore,
    --        iconPath,
    --        rarity
    -- FROM (
    --     SELECT itemKey, text, COUNT(*) AS item_count, perks, gearScore, iconPath , rarity
    --     FROM CTE
    --     GROUP BY itemKey
    -- ) AS item_counts

    UNION ALL

    SELECT 'Trading Post With Most Listings' AS category, NULL AS id, location AS name, COUNT(*) AS value, NULL AS perks, NULL AS gearScore, NULL AS iconPath, NULL rarity
    FROM CTE
    `
    let startTime = performance.now()
    const items = await db.execute({
        sql: query,
        args: {
            server,
        }
    })
    console.log('db timer - Items: ', performance.now() - startTime, ' ms', server)
    // console.log(items.rows)
    return json(items.rows);
};