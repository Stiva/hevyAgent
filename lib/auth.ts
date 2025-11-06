import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Email from "next-auth/providers/email"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: NeonAdapter(pool),
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      Email({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }),
    ],
    session: {
      strategy: "database",
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      async session({ session, user }) {
        if (session.user) {
          session.user.id = user.id
        }
        return session
      },
    },
  }
})
