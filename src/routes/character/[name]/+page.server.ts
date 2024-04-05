import { getCharacterById, getCharacterByName } from "@/server/db/gamedata/helpers";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params: { name } }) => {
  const session = await locals.auth()

  const character = getCharacterByName(name, session?.user)
  character.catch(e => console.log(e))

  return {
    character,
  }
}) satisfies PageServerLoad
