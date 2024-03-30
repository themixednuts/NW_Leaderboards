import { EDGE_CONFIG } from '$env/static/private'
import { createClient } from '@vercel/edge-config'

const client = createClient(EDGE_CONFIG)

export async function get_valid_seasons() {
  const season: number = await client.get('season') ?? 4
  return Array.from({ length: season + 1 }, (_, idx) => idx === 0 ? 'q1' : `s${idx}`) as readonly ('q1' | `s${number}`)[]
}
