import { createClient, type Config } from '@libsql/client/web'
import { TURSO_AUTH } from '$env/static/private'

const config: Config = {
  url: 'libsql://marketdata-themixednuts.turso.io',
  authToken: TURSO_AUTH,
}

export const db = createClient(config)

import { get } from '@vercel/edge-config'
export async function get_valid_seasons() {
  const season: number = await get('season') || 0
  return Array.from({ length: season + 1 }, (_, idx) => idx === 0 ? 'q1' : `s${idx}`) as readonly ('q1' | `s${number}`)[]

}

