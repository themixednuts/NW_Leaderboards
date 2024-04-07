import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const characters = sqliteTable("characters", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
  level: integer("level"),
  guildId: text("guild_id"),
  factionId: integer("faction_id"),
  worldId: text("world_id"),
  steamAppId: integer("steam_app_id"),
  foregroundImagePath: text("foreground_image_path"),
  backgroundImagePath: text("background_image_path"),
  midgroundImagePath: text("midground_image_path"),
  foregroundColor: text("foreground_color"),
  backgroundColor: text("background_color"),
  midgroundColor: text("midground_color"),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  visibility: text('visibility', { enum: ['private', 'public', 'guild'] }).notNull().default('private'),
});

export const charactersRelations = relations(characters, ({ one }) => ({
  guild: one(guilds, {
    fields: [characters.guildId],
    references: [guilds.id]
  })
}))

export const guilds = sqliteTable("guilds", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  guildmasterId: text("guildmaster_id"),
  factionId: integer("faction_id").notNull(),
  worldId: text("world_id"),
  foregroundImagePath: text("foreground_image_path"),
  backgroundImagePath: text("background_image_path"),
  foregroundColor: text("foreground_color"),
  backgroundColor: text("background_color"),
  numPlayers: integer("num_players").notNull(),
  numClaims: integer("num_claims"),
  visibility: text('visibility', { enum: ['private', 'public'] }).notNull().default('private'),
  submittedAt: text("submitted_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
  updatedAt: text('updated_at').notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  guildmaster: one(characters, {
    fields: [guilds.guildmasterId],
    references: [characters.id],

  }),
  characters: many(characters)
}))

export const insertCharacterSchema = createInsertSchema(characters)
export const selectCharacterSchema = createSelectSchema(characters)

export const insertGuildSchema = createInsertSchema(guilds)
export const selectGuildSchema = createSelectSchema(guilds)

export const visibilitySchema = insertCharacterSchema.pick({ name: true, visibility: true })
