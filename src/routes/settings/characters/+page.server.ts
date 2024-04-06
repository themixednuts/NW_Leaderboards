import type { PageServerLoad } from './$types'
import { error, type Actions } from '@sveltejs/kit'
import { getCharactersByUser, updateCharacterVisibility } from '@/server/db/gamedata/helpers'
import { message, superValidate, fail } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { visibilitySchema } from '@/schemas/gamedata'

export const load = (async ({ locals }) => {
  const session = await locals.auth()
  if (!session?.user?.id) return error(403, 'Not Authorized')

  const res = getCharactersByUser(session.user)
  res.catch(e => console.log(e))

  return {
    characters: res,
  }
}) satisfies PageServerLoad

export const actions = {
  visibility: async ({ locals, request }) => {
    const session = await locals.auth()
    const visibilityForm = await superValidate(request, zod(visibilitySchema))
    if (!session?.user?.id || !visibilityForm.valid || !visibilityForm.data.visibility) return fail(400, { visibilityForm })

    const update = await updateCharacterVisibility({ ...visibilityForm.data })
    return message(visibilityForm, { update })
  },

} satisfies Actions
