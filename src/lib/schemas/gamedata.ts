import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { LogEvent } from "@/events.types";

export const characters = sqliteTable("characters", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
  level: integer("level"),
  guildId: text("guild_id"),
  factionId: integer("faction_id"),
  worldId: text("world_id"),
  guildRank: text('guild_rank', { enum: ['governor', 'consul', 'officer', 'settler'] }).default('settler').notNull(),
  steamAppId: integer("steam_app_id"),
  foregroundImagePath: text("foreground_image_path"),
  backgroundImagePath: text("background_image_path"),
  midgroundImagePath: text("midground_image_path"),
  foregroundColor: text("foreground_color"),
  backgroundColor: text("background_color"),
  midgroundColor: text("midground_color"),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  visibility: text('visibility', { enum: ['private', 'public', 'guild'] }).notNull().default('private'),
});

export const insertCharacterSchema = createInsertSchema(characters)
export const selectCharacterSchema = createSelectSchema(characters)
export const visibilitySchema = insertCharacterSchema.pick({ name: true, visibility: true })

export const charactersRelations = relations(characters, ({ one, many }) => ({
  guild: one(guilds, {
    fields: [characters.guildId],
    references: [guilds.id]
  }),
  logs: many(logs),
  log: one(logs, {
    fields: [characters.id],
    references: [logs.characterId]
  }),
  charactersToGroups: many(charactersToGroups),
  paperdolls: many(paperdolls),
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
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const insertGuildSchema = createInsertSchema(guilds)
export const selectGuildSchema = createSelectSchema(guilds)

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  guildmaster: one(characters, {
    fields: [guilds.guildmasterId],
    references: [characters.id],

  }),
  characters: many(characters),
  logs: many(logs),
}))

export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey(),
  userId: text('user_id').notNull(),
  gameModeId: integer('game_mode_id'),
  characterId: text('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  guildId: text('guild_id').references(() => guilds.id),
  relatedTo: integer('related_to'),
  data: text('data', { mode: 'json' }).notNull().unique().$type<LogEvent[]>(),
  fileName: text('file_name').notNull(),
  tags: text('tags'),
  visibility: text('visibility', { enum: ['public', 'private'] }).notNull().default('public'),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const logRelations = relations(logs, ({ many, one }) => ({
  character: one(characters, {
    fields: [logs.characterId],
    references: [characters.id]
  }),
  guild: one(guilds, {
    fields: [logs.guildId],
    references: [guilds.id]
  }),
  log: one(logs, {
    fields: [logs.relatedTo],
    references: [logs.id]
  }),
}))

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  gameModeId: integer('game_mode_id'),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
})

export const groupsRelations = relations(groups, ({ many }) => ({
  characterToGroups: many(charactersToGroups),
}))

export const charactersToGroups = sqliteTable('groups_characters', {
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  characterId: text('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}, (tbl) => ({
  primary: primaryKey({ columns: [tbl.characterId, tbl.groupId] })
}))

export const charactersToGroupsRelations = relations(charactersToGroups, ({ one }) => ({
  character: one(characters, {
    fields: [charactersToGroups.characterId],
    references: [characters.id]
  }),
  group: one(groups, {
    fields: [charactersToGroups.groupId],
    references: [groups.id]
  })
}))

export const paperdolls = sqliteTable('paperdolls', {
  slotId: integer('slot_id'),
  characterId: text('character_id').notNull().references(() => characters.id),
  itemId: text('item_id'),
  gearscore: integer('gearscore'),
  perks: text('perks', { mode: 'json' }),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}, (tbl) => ({
  primary: primaryKey({ columns: [tbl.characterId, tbl.slotId] })
}))

export const paperdollsRelations = relations(paperdolls, ({ one }) => ({
  character: one(characters, {
    fields: [paperdolls.characterId],
    references: [characters.id]
  })
}))

export const guildRanks = sqliteTable('guild_ranks', {
  rank: text('rank', { enum: ['governor', 'consul', 'officer', 'settler'] }).notNull(),
  guildId: text('guild_id').notNull().references(() => guilds.id, { onDelete: 'cascade' }),
  canDeposit: integer('can_deposit', { mode: 'boolean' }).default(false),
  canWithdrawl: integer('can_withdrawal', { mode: 'boolean' }).default(false),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}, (tbl) => ({
  primary: primaryKey({ columns: [tbl.rank, tbl.guildId] })
}))

// export const equipments = sqliteTable('equipments', {
//   slotId: integer('slot_id'),
//   characterId: text('character_id').notNull().references(() => characters.id),
//   itemId: text('item_id'),
//   gearscore: integer('gearscore'),
//   perks: text('perks', { mode: 'json' }),
//   submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
//   updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
// }, (tbl) => ({
//   primary: primaryKey({ columns: [tbl.characterId, tbl.slotId] })
// }))


