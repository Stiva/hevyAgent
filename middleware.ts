import NextAuth from "next-auth"
import authConfig from "@/auth.config"

export const { auth: middleware } = NextAuth(authConfig)

export default middleware

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth routes)
     * - login page
     * - homepage (/)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|login|^$).*)",
  ],
}
