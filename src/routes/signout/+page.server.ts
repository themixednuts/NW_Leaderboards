import { signOut } from '$lib/server/db/users/auth.js'

export const load = (async () => {
    return {}
})

export const actions = {
    default: signOut
}