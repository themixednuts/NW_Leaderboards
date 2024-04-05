
import { sql, eq, or, inArray, and } from "drizzle-orm";
import { db } from "./client";
import { characters, guilds } from "./schema";
import { alias } from "drizzle-orm/sqlite-core";

const requestingCharacter = alias(characters, 'requesting')

// PREPARED STATEMENTS
export const p_characters_by_user = db.query.characters.findMany({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (eq(characters.userId, sql.placeholder('userId'))),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user')
  }
}).prepare()

export const p_character_by_id = db.query.characters.findFirst({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (
    and(
      eq(characters.id, sql.placeholder('id')),
      or(
        eq(characters.userId, sql.placeholder('userId')),
        inArray(characters.visibility, ['public']),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer']),
      )
    )

  ),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user'),
  }
}).prepare()

export const p_character_by_name = db.query.characters.findFirst({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (
    and(
      eq(characters.name, sql.placeholder('name')),
      or(
        eq(characters.userId, sql.placeholder('userId')),
        inArray(characters.visibility, ['public']),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer']),
      )
    )

  ),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user'),
  }
}).prepare()

export const p_guilds_with_members_by_user = db.query.guilds.findMany({
  with: {
    characters: {
      where: or(
        eq(characters.userId, sql.placeholder('userId')),
        eq(characters.visibility, 'public'),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    },
  },
  where: inArray(guilds.id, db.select({ id: characters.guildId }).from(characters).where(eq(characters.userId, sql.placeholder('userId'))))

}).prepare()

export const p_guild_with_members_by_id = db.query.guilds.findFirst({
  with: {
    characters: {
      where: or(
        eq(characters.userId, sql.placeholder('userId')),
        eq(characters.visibility, 'public'),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    },
    guildMaster: true
  },
  where: eq(guilds.id, sql.placeholder('id')),
}).prepare()
export const p_guild_with_members_by_name = db.query.guilds.findFirst({
  with: {
    characters: {
      where: or(
        eq(characters.userId, sql.placeholder('userId')),
        eq(characters.visibility, 'public'),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    },
    guildMaster: true
  },
  where: eq(guilds.name, sql.placeholder('name')),
}).prepare()

export const p_guild_by_id = db.query.guilds.findFirst({
  with: {
    guildMaster: true
  },
  where: eq(guilds.id, sql.placeholder('id')),
}).prepare()

export const p_visible_characters_guilds = db.query.characters.findMany({
  columns: {
    userId: false,
  },
  with: {
    guild: true
  },
  where: (eq(characters.userId, sql.placeholder('userId'))),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user')
  }
}).prepare()

