
import { sql, eq, or, inArray } from "drizzle-orm";
import { db } from "./client";
import { characters, guilds } from "./schema";

// PREPARED STATEMENTS
export const prepared_characters = db.query.characters.findMany({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (eq(characters.userId, sql.placeholder('userId')))
}).prepare()

export const prepared_character = db.query.characters.findFirst({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (eq(characters.userId, sql.placeholder('userId')))
}).prepare()

export const prepared_visible_characters_guilds = db.query.characters.findMany({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (eq(characters.userId, sql.placeholder('userId')))
}).prepare()

export const prepared_guilds_with_members = db.query.guilds.findFirst({
  with: {
    characters: {
      where: or(
        inArray(characters.visibility, ['public', 'guild']),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    }
  },
  where: inArray(guilds.id, db.select({ id: characters.guildId }).from(characters).where(eq(characters.userId, sql.placeholder('userId'))))
}).prepare()
