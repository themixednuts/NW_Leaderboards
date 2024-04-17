import { defineConfig } from 'drizzle-kit'


export default defineConfig({
  schema: "./src/lib/schemas/gamedata.ts",
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_GAMEDATA_URL!,
    authToken: process.env.TURSO_NW_AUTH!
  },
  out: './scripts/gamedata/migrations'
})     
