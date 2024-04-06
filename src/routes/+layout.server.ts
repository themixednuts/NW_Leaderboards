import type { WorldsData } from "@/utils"
import type { LayoutServerLoad } from "./$types"
import { client } from '@/server/db/gamedata/client'
import { dev } from "$app/environment"
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { visibilitySchema } from "$lib/schemas/gamedata"

// if (dev) await client.sync()

export const load = (async ({ locals }) => {
  const worlds = fetch('https://gt-servers.nwdb.info/server-status/d97f9hg7132dhasei12j93hdasr18j_gt').then(res => res.json() as Promise<WorldsData>)
  worlds.catch(e => console.log(e))

  return {
    session: await locals.auth(),
    visibilityForm: await superValidate(zod(visibilitySchema)),
    // searchForm: await superValidate(zod()),
    worlds
  }
}) satisfies LayoutServerLoad
