import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { server } }) => {

    const query = `
    --EXPLAIN QUERY PLAN
    SELECT 'Highest Price' AS category, itemKey AS id, text AS name, MAX(price) / 100 AS value, perks, gearScore, COALESCE (weapon.IconPath, armor.IconPath, instruments.IconPath, master.IconPath) AS iconPath, rarity   
    FROM orders
    LEFT JOIN MasterItemDefinitions AS master ON master.ItemID = itemKey COLLATE NOCASE
    LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
    LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
    LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
    LEFT JOIN locale_en_us as locale ON locale.key = SUBSTR(master.Name, 2) COLLATE NOCASE
    WHERE sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
    AND contractType = 1

    UNION ALL

    SELECT 'Most Quantity' AS category, itemKey AS id, text AS item, SUM(quantity) AS value, perks, gearScore, COALESCE (weapon.IconPath, armor.IconPath, instruments.IconPath, master.IconPath) AS iconPath, rarity   
    FROM orders
    LEFT JOIN MasterItemDefinitions AS master ON master.ItemID = itemKey COLLATE NOCASE
    LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
    LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
    LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
    LEFT JOIN locale_en_us as locale ON locale.key = SUBSTR(master.Name, 2)
    WHERE sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
    AND contractType = 1

    UNION ALL

    SELECT 'Most Uniquely Listed Item' AS category, 
           itemKey AS id, 
           text AS item,
           MAX(item_count) AS value,
           perks,
           gearScore,
           iconPath,
           rarity
    FROM (
        SELECT itemKey, text, COUNT(*) AS item_count, perks, gearScore, COALESCE (weapon.IconPath, armor.IconPath, instruments.IconPath, master.IconPath) AS iconPath, rarity
        FROM orders
        LEFT JOIN MasterItemDefinitions AS master ON master.ItemID = itemKey COLLATE NOCASE
        LEFT JOIN ArmorAppearances AS armor ON armor.ItemID = master.ArmorAppearanceM COLLATE NOCASE
        LEFT JOIN WeaponAppearanceDefinitions AS weapon ON weapon.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
        LEFT JOIN InstrumentsAppearanceDefinitions AS instruments ON instruments.WeaponAppearanceID = master.WeaponAppearanceOverride COLLATE NOCASE
        LEFT JOIN locale_en_us AS locale ON locale.key = SUBSTR(master.Name, 2)
        WHERE sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
        AND contractType = 1
        GROUP BY itemKey
    ) AS item_counts

    UNION ALL

    SELECT 'Trading Post With Most Listings' AS category, NULL AS id, location AS item, COUNT(*) AS value, NULL AS perks, NULL AS gearScore, NULL AS iconPath, NULL rarity
    FROM orders
    WHERE sessionDate = (SELECT sessionDate FROM server_metadata WHERE server = :server)
    AND contractType = 1;
    `
    let startTime = performance.now()
    const items = await db.execute({
        sql: query,
        args: {
            server,
        }
    })
    console.log('db timer - Items: ', performance.now() - startTime, ' ms')
    return json(items.rows);
};