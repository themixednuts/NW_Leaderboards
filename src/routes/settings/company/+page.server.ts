import { getCompaniesAndMembers } from "@/server/db/gamedata/helpers";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import type { users } from "@/server/db/users/schema";

export const load = (async ({ locals }) => {
  const session = await locals.auth()
  if (!session?.user?.id) return error(500)

  return {
    companies: getCompaniesAndMembers(session.user.id, session.user.role!)
  }

}) satisfies PageServerLoad
