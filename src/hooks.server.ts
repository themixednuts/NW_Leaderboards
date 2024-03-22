import { handle as auth } from '$lib/server/db/users/auth'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const authorization: Handle = async ({ event, resolve }) => {
    const { url, locals } = event
    const session = await locals.auth()

    if (url.pathname.startsWith('/logs') && !session) redirect(303, '/signin')
    return resolve(event)
}

export const handle: Handle = sequence(auth, authorization)

declare module "@auth/core/types" {
    interface Session {
        error?: "RefreshAccessTokenError"
    }
}