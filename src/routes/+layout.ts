import { dev } from '$app/environment'
import { inject } from '@vercel/analytics'
import type { LayoutLoad } from './$types'
import type { Actions } from '@sveltejs/kit'

inject({ mode: dev ? 'development' : 'production' })

export const load = (async ({ data: { session } }) => {

  return {
    session,
  }
}) satisfies LayoutLoad
