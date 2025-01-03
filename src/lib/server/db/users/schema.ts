import { integer, sqliteTable, text, primaryKey, index } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'crypto'
import type { AdapterAccountType } from '@auth/core/adapters'

export const users = sqliteTable('user', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin', 'maintainer'] })
    .notNull()
    .default('user'),
})

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
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
  (account) => ([
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index('Account_userId_index').on(account.userId),
  ]),
)

export const sessions = sqliteTable(
  'session',
  {
    sessionToken: text('sessionToken').primaryKey().notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ([
    index('Session_userId_index').on(table.userId),
  ]),
)

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ([
    primaryKey({ columns: [vt.identifier, vt.token] }),
  ]),
)

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ([
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ])
)