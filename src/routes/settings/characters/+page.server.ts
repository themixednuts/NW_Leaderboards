import type { PageServerLoad } from './$types'
import { error, fail, type Actions } from '@sveltejs/kit'
import { getCharactersByUser, updateCharacterVisibility } from '@/server/db/gamedata/helpers'
import type { characters } from '@/server/db/gamedata/schema'

export const load = (async ({ locals }) => {
  const session = await locals.auth()
  if (!session?.user?.id) return error(403, 'Not Authorized')

  const res = getCharactersByUser(session.user.id)
  res.catch(e => console.log(e))

  return {
    characters: res
  }
}) satisfies PageServerLoad

export const actions = {
  visibility: async ({ locals, request }) => {
    const session = await locals.auth()
    if (!session?.user?.id) return fail(400, { message: 'Not Authorized' })

    const data = await request.formData()
    const visibility = data.get('visibility') as typeof characters.$inferInsert.visibility
    const character_string = data.get('character')

    if (!character_string || typeof character_string !== 'string') return fail(400, { message: 'Incorrect Type' })

    const character = JSON.parse(character_string) as typeof characters.$inferInsert

    const upsert = await updateCharacterVisibility({ ...character, visibility })

    return {
      success: true,
      upsert
    }

  },

} satisfies Actions
