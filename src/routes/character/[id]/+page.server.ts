import { getCharacterById } from "@/server/db/gamedata/helpers";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params: { id } }) => {
  const session = await locals.auth()

  const character = getCharacterById(id, session?.user)

  return {
    character,
  }
}) satisfies PageServerLoad
