
import { getCompanyWithMembersById } from "@/server/db/gamedata/helpers";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params: { id } }) => {
  const session = await locals.auth()

  const company = getCompanyWithMembersById(id, session?.user)
  return {
    company
  }

}) satisfies PageServerLoad
