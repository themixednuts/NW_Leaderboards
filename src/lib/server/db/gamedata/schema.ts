import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const characters = sqliteTable('characters', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  level: integer('level'),
  guildId: text('guild_id'),
  factionId: integer('faction_id'),
  worldId: text('world_id'),
  steamAppId: integer('steam_app_id'),
  foregroundImagePath: text('foreground_image_path'),
  backgroundImagePath: text('background_image_path'),
  midgroundImagePath: text('midground_image_path'),
  foregroundColor: text('foreground_color'),
  backgroundColor: text('background_color'),
  midgroundColor: text('midground_color'),
  visibility: text('visibility', { enum: ['private', 'public', 'guild'] }).notNull().default('private'),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
})

export const charactersRelations = relations(characters, ({ one }) => ({
  guild: one(guilds, {
    fields: [characters.guildId],
    references: [guilds.id]
  })
}))

export const guilds = sqliteTable('guilds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  guildMasterId: text('guildmaster_id'),
  factionId: integer('faction_id').notNull(),
  worldId: text('world_id'),
  foregroundImagePath: text('foreground_image_path'),
  backgroundImagePath: text('background_image_path'),
  foregroundColor: text('foreground_color'),
  backgroundColor: text('background_color'),
  numPlayers: integer('num_players').notNull(),
  numClaims: integer('num_claims'),
  visibility: text('visibility', { enum: ['private', 'public'] }).notNull().default('private'),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  guildMaster: one(characters, {
    fields: [guilds.guildMasterId],
    references: [characters.id],

  }),
  characters: many(characters)
}))
