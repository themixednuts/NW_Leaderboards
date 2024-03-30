import { handle as authjs } from '$lib/server/db/users/auth'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const authorization = (async ({ event, resolve }) => {
  const { url, locals } = event
  const session = await locals.auth()

  if (session?.user?.id && url.pathname.startsWith('/signin')) redirect(303, '/')

  if ((url.pathname.startsWith('/logs') || url.pathname.startsWith('/settings')) && !session) redirect(303, '/signin')
  return resolve(event)
}) satisfies Handle

export const handle = sequence(authjs, authorization) satisfies Handle

declare module "@auth/core/types" {
  interface Session {
    error?: "RefreshAccessTokenError"
  }
}
