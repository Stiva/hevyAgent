import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: NeonAdapter(pool),
  session: { strategy: "jwt" }, // Changed from "database" to "jwt" for Edge Runtime compatibility
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
})
