import type { User } from "@auth/core/types"
import type { users } from "../users/schema"
import { db } from "./client"
import { characters, guilds } from "./schema"
import { p_character_by_id, p_characters_by_user, p_guild_by_id, p_guild_with_members_by_id, p_guilds_with_members_by_user } from "./statements"

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

export const updateCharacterVisibility = async (character: typeof characters.$inferInsert) => {
  return db.insert(characters).values(character).onConflictDoUpdate({
    target: characters.id,
    set: {
      visibility: character.visibility
    }
  }).returning()
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

export const getCompanyById = async (id: typeof guilds.$inferSelect.id, user?: User) => {
  const role = user?.role ?? null
  const userId = user?.id ?? null

  return p_guild_by_id.get({ userId, role, id })
}
