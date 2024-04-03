import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { getCharacterById } from '@/server/db/gamedata/helpers'

export const GET = (async ({ locals, params: { id } }) => {
  const session = await locals.auth()

  const character = await getCharacterById(id, session?.user)

  return json({ type: 'character', ...character })
}) satisfies RequestHandler 
