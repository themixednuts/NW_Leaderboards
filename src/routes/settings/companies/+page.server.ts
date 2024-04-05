import { getCompaniesWithMembersByUser } from "@/server/db/gamedata/helpers";
import type { PageServerLoad } from "../company/$types";
import { error } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  const session = await locals.auth()
  if (!session?.user?.id) return error(500)

  return {
    companies: getCompaniesWithMembersByUser(session.user)
  }

}) satisfies PageServerLoad
