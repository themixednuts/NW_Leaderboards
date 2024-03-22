import { SvelteKitAuth } from "@auth/sveltekit"
import { DISCORD_SECRET, DISCORD_ID } from "$env/static/private"
import Discord from '@auth/sveltekit/providers/discord'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from "./client"

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET })],
    adapter: DrizzleAdapter(db)
})