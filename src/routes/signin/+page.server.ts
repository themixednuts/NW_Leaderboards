import { signIn } from "$lib/server/db/users/auth"
import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals }) => {
  return {}
}) satisfies PageServerLoad

export const actions = {
  default: signIn
} satisfies Actions

