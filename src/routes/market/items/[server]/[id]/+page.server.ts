import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import type { MarketData } from '$lib/market.types'
import type { Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
  //@ts-ignore
  isr: null,
  runtime: 'edge'
}

export const load = (async ({ params: { server, id }, url: { searchParams } }) => {
  const days = +(searchParams.get('days') || 7)
  const end_date = new Date()
  const start_date = new Date(end_date)
  start_date.setDate(start_date.getDate() - days)
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
  AND sessionDate >= :start_date 
  AND sessionDate <= :end_date
  -- GROUP BY sessionDate, contractType, price
  `
  const nameQuery = `
  SELECT 
  locale.text AS name 
  FROM MasterItemDefinitions
  LEFT JOIN locale_en_us AS locale ON locale.key = SUBSTR(Name,2) COLLATE NOCASE
  WHERE ItemID = ? COLLATE NOCASE
  `
  const sessionQuery = `
    SELECT
    sessionDate
    FROM server_metadata
    WHERE server = :server`

  const startTime = performance.now()
  const [itemData, name, sessionDate] = await db.batch([
    {
      sql: query,
      args: {
        id,
        server,
        end_date: Math.floor(end_date.getTime() / 1000),
        start_date: Math.floor(start_date.getTime() / 1000)
      }
    },
    {
      sql: nameQuery,
      args: [id]
    },
    {
      sql: sessionQuery,
      args: {
        server
      }
    }
  ], 'read')
  console.log('db timer: ', performance.now() - startTime, ' ms')
  return {
    itemData: itemData.rows as unknown as MarketData[],
    name: name.rows[0].name,
    lastSession: sessionDate.rows[0].sessionDate,
    days
  }
}) satisfies PageServerLoad

