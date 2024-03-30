// import { error } from "@sveltejs/kit"

import type { LayoutServerLoad } from "./$types"

export const load = (async ({ event, locals }) => {

  // if (!session) return error(400)

  return {

  }
}) satisfies LayoutServerLoad 
