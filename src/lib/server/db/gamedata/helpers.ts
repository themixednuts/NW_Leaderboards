import type { User } from "@auth/core/types"
import { db } from "./client"
import { characters, guilds } from "./schema"
import { p_character_by_id, p_character_by_name, p_characters_by_user, p_guild_by_id, p_guild_with_members_by_id, p_guild_with_members_by_name, p_guilds_with_members_by_user } from "./statements"
import { eq } from "drizzle-orm"

// HELPER FUNCTIONS
export const getCharactersByUser = async (user?: User) => {
  const userId = user?.id ?? null
  return p_characters_by_user.all({ userId })
}

export const getCharacterById = async (id: typeof characters.$inferSelect.id, user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null
  return p_character_by_id.get({ id, userId, role })
}
export const getCharacterByName = async (name: typeof characters.$inferSelect.name, user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null
  name = name.replaceAll('_', ' ')

  return p_character_by_name.get({ name, userId, role })
}

export const updateCharacterVisibility = async (character: { name: typeof characters.$inferInsert.name, visibility?: typeof characters.$inferInsert.visibility }) => {
  const { name, visibility } = character
  return db.update(characters).set({ visibility }).where(eq(characters.name, name)).returning().get()
}

export const getCompaniesWithMembersByUser = async (user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null
  return p_guilds_with_members_by_user.all({ userId, role })
}

export const getCompanyWithMembersById = async (id: typeof guilds.$inferSelect.id, user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null

  return p_guild_with_members_by_id.get({ userId, role, id })
}

export const getCompanyWithMembersByName = async (name: typeof guilds.$inferSelect.name, user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null
  name = name.replaceAll('_', ' ')

  return p_guild_with_members_by_name.get({ userId, role, name })
}

export const getCompanyById = async (id: typeof guilds.$inferSelect.id, user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null

  return p_guild_by_id.get({ userId, role, id })
}
