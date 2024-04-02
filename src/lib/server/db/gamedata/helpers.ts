import type { users } from "../users/schema"
import { db } from "./client"
import { characters, guilds } from "./schema"
import { prepared_characters, prepared_guilds_with_members } from "./statements"

// HELPER FUNCTIONS
export const getCharactersByUser = async (userId: typeof characters.$inferSelect.userId) => {
  return prepared_characters.all({ userId })
}

export const updateCharacterVisibility = async (character: typeof characters.$inferInsert) => {
  return db.insert(characters).values(character).onConflictDoUpdate({
    target: characters.id,
    set: {
      visibility: character.visibility
    }
  }).returning()
}

export const getCompaniesAndMembers = async (userId: typeof characters.$inferSelect.userId, role: typeof users.$inferSelect.role) => {
  return prepared_guilds_with_members.all({ userId, role })
}
