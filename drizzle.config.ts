import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./src/lib/server/db/users/schema.ts",
    out: './drizzle/migrations',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.TURSO_URL!,
        authToken: process.env.TURSO_AUTH!
    },
})     