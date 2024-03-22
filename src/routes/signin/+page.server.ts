import { signIn } from "$lib/server/db/users/auth"
import type { Actions } from "@sveltejs/kit"
export const load = (async () => {
    return {}
})

export const actions: Actions = {
    default: signIn
}

