
import { sql, eq } from "drizzle-orm";
import { db } from "./client";
import { characters } from "./schema";

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
