import { db } from "./client"
import { characters } from "./schema"
import { prepared_characters } from "./statements"

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
