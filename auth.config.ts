import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Edge-compatible configuration for middleware
// Note: Email provider is in lib/auth.ts (requires Node.js for SMTP)
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Return true to allow access, false to redirect to login
      return !!auth
    },
    redirect: async ({ url, baseUrl }) => {
      // Redirect to dashboard after sign-in
      if (url === baseUrl || url === `${baseUrl}/login`) {
        return `${baseUrl}/dashboard`
      }
      // Handle relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Handle same origin URLs
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
} satisfies NextAuthConfig
