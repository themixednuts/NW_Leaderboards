import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import type { MarketData } from '$lib/market.types'
import type { Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
  runtime: 'edge'
}
export const load = (async ({ params: { server, id }, url: {searchParams} }) => {
  const days = +(searchParams.get('days') || 7)
  const query = `
  -- EXPLAIN QUERY PLAN
  SELECT
  sessionDate, 
  price,
  perks,
  quantity,
  contractType,
  gearScore,
  rarity
  FROM orders 
  WHERE server = :server
  AND itemKey = :id COLLATE NOCASE
  AND sessionDate >= strftime('%Y-%m-%dT%H:%M:%S', 'now', - :days || ' days', 'start of day') 
  AND sessionDate <= strftime('%Y-%m-%dT%H:%M:%S', 'now')  
  `
  let startTime = performance.now()
  const itemData = await db.execute({
    sql: query,
    args: {
      id,
      server,
      days
    },
  })
  console.log('db timer - Items: ', performance.now() - startTime, ' ms')
  // console.log(itemData)

  const nameQuery = `
  SELECT 
  locale.text AS name 
  FROM MasterItemDefinitions
  LEFT JOIN locale_en_us AS locale ON locale.key = SUBSTR(Name,2)
  WHERE ItemID = ? COLLATE NOCASE
  `
  startTime = performance.now()
  const name = await db.execute({
    sql: nameQuery,
    args: [id]
  })
  console.log('db timer - Name: ', performance.now() - startTime, ' ms')

  const sessionQuery = `
    SELECT
    sessionDate
    FROM server_metadata
    WHERE server = :server`

  startTime = performance.now()
  const sessionDate = await db.execute({
    sql: sessionQuery,
    args: {
      server
    }
  })
  console.log('db timer - SessionDate: ', performance.now() - startTime, ' ms')
  return {
    itemData: itemData.rows as unknown as MarketData[],
    name: name.rows[0].name,
    lastSession: sessionDate.rows[0].sessionDate,
    days
  }
}) satisfies PageServerLoad

