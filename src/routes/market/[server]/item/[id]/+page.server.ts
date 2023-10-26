import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import type { MarketData } from '$lib/market.types'

export const load = (async ({ params: { server, id } }) => {
  const query = `
  SELECT 
  *
   FROM ${server} 
  WHERE itemKey = ? COLLATE NOCASE
  AND sessionDate >= strftime('%Y-%m-%dT%H:%M:%S', 'now', '-30 days', 'start of day') 
  AND sessionDate <= strftime('%Y-%m-%dT%H:%M:%S', 'now')  
  `
  const itemData = await db.execute({
    sql: query,
    args: [id],
  })


  const nameQuery = `
  SELECT 
  locale.text AS name 
  FROM MasterItemDefinitions
  LEFT JOIN masteritem_en_us AS locale ON locale.key = SUBSTR(Name,2)
  WHERE ItemID = ? COLLATE NOCASE
  `
  const name = await db.execute({
    sql: nameQuery,
    args: [id]
  })

  const sessionQuery = `
    SELECT
    lastSessionDate AS sessionDate
    FROM server_metadata
    WHERE name = :server`
  const sessionDate = await db.execute({
    sql: sessionQuery,
    args: {
      server
    }
  })
  return {
    itemData: itemData.rows as unknown as MarketData[],
    name: name.rows[0].name,
    lastSession: sessionDate.rows[0].sessionDate
  }
}) satisfies PageServerLoad

