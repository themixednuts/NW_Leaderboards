import { fail, message, setError, superValidate, type Infer } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema, type FormSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { db } from "@/server/db/gamedata/client";
import { characters, guilds } from "@/schemas/gamedata";
import { and, eq, not } from "drizzle-orm";
import { GUILD_RANKS } from "@/utils";

export const load = (async ({ locals }) => {

  return {
    form: await superValidate(zod(formSchema))
  }

}) satisfies PageServerLoad

export const actions = {
  rank: async (event) => {
    const form = await superValidate(event, zod(formSchema))
    if (!form.valid) return fail(400, { form })

    const session = await event.locals.auth()
    if (!session?.user?.id) {
      return setError(form, '', 'Not Authorized', { status: 500 })
    }
    const { name, guildRank } = form.data

    const { params } = event



    const returning = db.transaction(async (tx) => {
      const guild = await tx.query.guilds.findFirst({
        with: {
          characters: {
            where: eq(characters.userId, session!.user!.id!)
          }
        },
        where: eq(guilds.name, params.name)
      })

      const character = guild?.characters[0]

      // if (session.user?.role !== 'admin' && session.user?.role !== 'maintainer') {
      if (!guild || !character) {
        // console.log('no user')
        return
      }

      if (GUILD_RANKS[character.guildRank] <= GUILD_RANKS[guildRank ?? 'settler']) {
        // console.log('rank not high enough')
        return
      }
      // }

      return await tx.update(characters).set({
        guildRank
      })
        .where(and(eq(characters.name, name), not(eq(characters.id, character?.id ?? ''))))
        .returning({ guildRank: characters.guildRank })
        .get()
    }, {
      behavior: 'deferred'
    })

    const err = returning.catch(e => {
      console.log(e)
      return true
    })

    if (await err === true || !(await returning)) return setError(form, '', 'No character with high enough rank')

    return message(form, `Updated ${name}'s rank to ${(await returning)?.guildRank}.`)

  },
  // default: async ({ request }) => {
  //   console.log('default members action')
  // }
} satisfies Actions
