import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./src/lib/server/db/users/schema.ts",
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_URL!,
        authToken: process.env.TURSO_AUTH!
    },
    out: './drizzle/migrations'
})     