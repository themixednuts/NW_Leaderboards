import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { getCompanyById } from '@/server/db/gamedata/helpers'

export const GET = (async ({ locals, params: { id } }) => {
  const session = await locals.auth()

  const company = await getCompanyById(id, session?.user)

  return json({ type: 'guild', ...company })
}) satisfies RequestHandler
