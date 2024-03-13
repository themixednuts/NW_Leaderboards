import type { LayoutServerLoad } from './$types'
import { get_valid_seasons } from '$lib/server/db'

export const load = (async () => {
    const validSeasons = await get_valid_seasons()
    return {
        validSeasons
    }
}) satisfies LayoutServerLoad