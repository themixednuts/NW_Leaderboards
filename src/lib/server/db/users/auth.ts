import { SvelteKitAuth } from "@auth/sveltekit"
import { DISCORD_SECRET, DISCORD_ID } from "$env/static/private"
import Discord from '@auth/sveltekit/providers/discord'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from "./client"
import { dev } from "$app/environment"
import { users } from "./schema"
import { eq } from "drizzle-orm"

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [Discord({
    clientId: DISCORD_ID,
    clientSecret: DISCORD_SECRET,
    profile(profile) {
      return {
        ...profile,
        role: 'user',
      }
    },
  })],
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session({ session, user }) {
      session.user.role = (await db.select({ role: users.role }).from(users).where(eq(users.id, user.id)).get())?.role ?? 'user'
      return session
    },
  },
  pages: {
    // signIn: '/sign'
  },
  useSecureCookies: dev ? false : true,

})
