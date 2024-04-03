import type { WorldsData } from "@/utils"
import type { LayoutServerLoad } from "./$types"
import type { Actions } from "@sveltejs/kit"

export const load = (async ({ locals }) => {
  const worlds = fetch('https://gt-servers.nwdb.info/server-status/d97f9hg7132dhasei12j93hdasr18j_gt').then(res => res.json() as Promise<WorldsData>)
  worlds.catch(e => console.log(e))

  return {
    session: await locals.auth(),
    worlds
  }
}) satisfies LayoutServerLoad
