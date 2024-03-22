import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./src/lib/server/db/users/schema.ts",
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_URL_DEV!,
        authToken: process.env.TURSO_SECRET!
    },
    out: './drizzle/migrations'
})     