import { handle as authentication } from '$lib/server/db/users/auth'
import { sessions, type users } from '@/server/db/users/schema'
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const authorization = (async ({ event, resolve }) => {
  const { url, locals } = event

  if (url.pathname.startsWith('/signin')) {
    const session = await locals.auth()

    if (!session?.user?.id) redirect(303, '/')
  }

  if (url.pathname.startsWith('/settings')) {
    const session = await locals.auth()
    if (!session?.user?.id) redirect(303, '/signin')
  }

  if (url.pathname.startsWith('/reports')) {
    const session = await locals.auth()
    if (!session?.user?.id && (session?.user?.role !== 'admin' || session?.user?.role !== 'maintianer'))
      redirect(303, '/')
  }

  return resolve(event)
}) satisfies Handle

export const handle = sequence(authentication, authorization) satisfies Handle

declare module '@auth/core/types' {
  export interface Session {
    error?: 'RefreshAccessTokenError'
  }
  export interface User {
    role: typeof users.$inferSelect.role
  }
}

export const handleError = (async ({ error, event, status, message }) => {
  const errorId = crypto.randomUUID()
  console.log(status, error)

  return {
    message,
    errorId,
  }
}) satisfies HandleServerError
