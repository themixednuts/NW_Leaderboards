
import { getCompanyWithMembersByName } from "@/server/db/gamedata/helpers";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params: { name } }) => {
  const session = await locals.auth()

  const company = getCompanyWithMembersByName(name, session?.user)
  return {
    company
  }

}) satisfies PageServerLoad
