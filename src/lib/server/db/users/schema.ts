import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import type { AdapterAccount } from '@auth/core/adapters'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin', 'maintainer'] }).notNull().default('user')
})

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
export const characters = sqliteTable('characters', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  name: text('name').notNull(),
  level: integer('level'),
  guildId: text('guild_id'),
  factionId: integer('faction_id').notNull(),
  worldId: text('world_id').notNull(),
  // steamAppId: integer('steam_app_id').notNull(),
  foregroundImagePath: text('foreground_image_path'),
  backgroundImagePath: text('background_image_path'),
  midgroundImagePath: text('midground_image_path'),
  foregroundColor: text('foreground_color'),
  backgroundColor: text('background_color'),
  midgroundColor: text('midground_color'),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const guilds = sqliteTable('guilds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  guildMasterId: text('guildmaster_id'),
  factionId: integer('faction_id'),
  crestForeground: text('crest_foreground'),
  crestBackground: text('crest_background'),
  numPlayers: integer('num_players').notNull(),
  submittedAt: text('submitted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})
