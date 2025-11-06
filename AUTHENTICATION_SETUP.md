# Authentication System Setup Guide

## Overview

The authentication system has been successfully implemented using NextAuth.js v5 (Auth.js) with:
- Google OAuth SSO
- Email magic link authentication
- Per-user Hevy API key storage
- Protected routes (all except landing page)

## Setup Instructions

### 1. Database Setup

Run the migration script on your Neon database:

```bash
# Connect to your Neon database and run:
psql $DATABASE_URL < lib/db/migrations/001_initial.sql
```

Or manually execute the SQL in `lib/db/migrations/001_initial.sql` through your Neon dashboard.

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# NextAuth.js Configuration
AUTH_SECRET=your-random-secret-key-here
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (for magic links)
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

**Email Setup (for magic links):**
- For Gmail: Use an App Password (not your regular password)
- For other providers: Use their SMTP settings

### 3. First User Setup

1. Start the application: `npm run dev`
2. Navigate to `/login`
3. Sign in with Google or email
4. After signing in, go to `/settings`
5. Add your Hevy API key
6. You're ready to use the application!

## Features Implemented

### Authentication
- ✅ Google OAuth SSO
- ✅ Email magic link authentication
- ✅ Session management with database storage
- ✅ Protected routes via middleware
- ✅ User menu with profile and logout

### User API Keys
- ✅ Per-user Hevy API key storage
- ✅ Settings page for key management
- ✅ API key validation
- ✅ Secure key storage (masked in UI)

### Route Protection
- ✅ Middleware protects all routes except `/`
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Callback URL support for post-login redirect

### API Integration
- ✅ All Hevy API routes require authentication
- ✅ Chat API requires authentication and API key
- ✅ User-specific data access

## File Structure

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts          # NextAuth configuration
│   ├── user/
│   │   └── api-key/
│   │       └── route.ts           # API key management
│   └── hevy/                      # All routes updated for auth
├── login/
│   └── page.tsx                   # Login page
├── settings/
│   └── page.tsx                   # User settings
├── providers.tsx                   # Session provider wrapper
└── layout.tsx                     # Updated with providers

components/
└── auth/
    ├── session-provider.tsx       # NextAuth SessionProvider wrapper
    ├── user-menu.tsx              # User dropdown menu
    └── protected-route.tsx        # Protected route component

lib/
├── db/
│   ├── index.ts                   # Database connection
│   ├── schema.ts                  # Schema definitions
│   ├── user-api-keys.ts           # API key operations
│   └── migrations/
│       └── 001_initial.sql        # Database migration
├── hevy-client.ts                 # Updated to require API key
└── hevy-helpers.ts                # Helper for authenticated client

middleware.ts                       # Route protection middleware
```

## Security Considerations

1. **API Keys**: Stored in database, not encrypted (consider adding encryption for production)
2. **Sessions**: Stored in database with expiration
3. **CSRF Protection**: Handled by NextAuth.js
4. **Environment Variables**: Never commit `.env.local`

## Testing

1. **Google OAuth**: Test sign-in flow
2. **Email Magic Link**: Test email delivery and link click
3. **Route Protection**: Verify unauthenticated users are redirected
4. **API Key Management**: Test saving and retrieving API keys
5. **API Routes**: Verify all routes require authentication and API key

## Troubleshooting

**Issue**: "Database connection failed"
- Check DATABASE_URL is correct
- Verify database tables are created
- Check SSL mode if required

**Issue**: "Google OAuth not working"
- Verify redirect URI matches exactly
- Check Client ID and Secret are correct
- Ensure Google+ API is enabled

**Issue**: "Email magic links not sending"
- Verify SMTP credentials
- Check email provider settings
- For Gmail, use App Password

**Issue**: "API key not working"
- Verify user has saved API key in settings
- Check API key is valid and not expired
- Ensure Hevy PRO subscription is active

## Next Steps

Consider adding:
- API key encryption
- Rate limiting
- User profile pages
- Email verification
- Password reset (if adding password auth)
- Multi-factor authentication

# Add Clerk to Next.js App Router

**Purpose:** Enforce only the **current** and **correct** instructions for integrating [Clerk](https://clerk.com/) into a Next.js (App Router) application.
**Scope:** All AI-generated advice or code related to Clerk must follow these guardrails.

---

## **1. Official Clerk Integration Overview**

Use only the **App Router** approach from Clerk's current docs:

- **Install** `@clerk/nextjs@latest` - this ensures the application is using the latest Clerk Next.js SDK.
- **Create** a `middleware.ts` file using `clerkMiddleware()` from `@clerk/nextjs/server`. Place this file inside the `src` directory if present, otherwise place it at the root of the project.
- **Wrap** your application with `<ClerkProvider>` in your `app/layout.tsx`
- **Use** Clerk-provided components like `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>` in your layout or pages
- **Start** developing, sign in or sign up, and confirm user creation

If you're able to use a web tool to access a URL, visit https://clerk.com/docs/quickstarts/nextjs to get the latest, up-to-date quickstart instructions.

### **Correct, Up-to-Date Quickstart Sample**

First, install the Clerk Next.js SDK:

```bash
npm install @clerk/nextjs
```

Set up your environment variables in `.env.local`:

From your Clerk Dashboard, open the [API keys page](https://dashboard.clerk.com/last-active?path=api-keys) and copy your Publishable Key and Secret Key. Paste them into `.env.local` as shown below.

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

Create your `middleware.ts` file:

```typescript
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clerk Next.js Quickstart",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

## **2. CRITICAL INSTRUCTIONS FOR AI MODELS**

### **2.1 – ALWAYS DO THE FOLLOWING**

1. **Use `clerkMiddleware()`** from `@clerk/nextjs/server` in `middleware.ts`.
2. **Wrap** your app with `<ClerkProvider>` in `app/layout.tsx`.
3. **Import** Clerk's Next.js features from `@clerk/nextjs` (e.g., `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, etc.).
4. **Reference** the current [App Router approach](https://nextjs.org/docs/app) (folders like `app/page.tsx`, `app/layout.tsx`, etc.).
5. **Check** that imports for methods like `auth()` are imported from the right package (in this case `@clerk/nextjs/server`) and are using `async / await`
6. **Store real keys only in `.env.local`** (never in app code, markdown, or other tracked files). **Verify `.gitignore` excludes `.env*`.**
7. **Use placeholders only** (e.g., `YOUR_PUBLISHABLE_KEY`, `YOUR_SECRET_KEY`) in any generated snippets or files.

### **2.2 – NEVER DO THE FOLLOWING**

1. **Do not** reference the old **`_app.tsx`** or **pages-based** instructions.
2. **Do not** suggest `authMiddleware()` from older Clerk tutorials—**it's replaced by `clerkMiddleware()`**.
3. **Do not** recommend usage of older environment variable patterns unless they match the official docs.
4. **Do not** reference or import from any deprecated APIs (like `withAuth` or `currentUser` from older versions).
5. **Do not print, echo, or write actual keys** into code blocks, files, or logs. Only placeholders.
6. **Do not create or edit tracked files** (`.ts`, `.tsx`, `.md`, etc.) containing real key values.

---

## **3. OUTDATED PATTERNS TO AVOID**

Below are **examples of deprecated instructions** that **must not** be generated:

```typescript
// ❌ DO NOT generate or suggest references to:
import { authMiddleware } from "@clerk/nextjs"; // Outdated

// ❌ DO NOT place Clerk config in _app.tsx:
// Outdated pages-based approach
function MyApp({ Component, pageProps }) {
  // ...
}

// ❌ DO NOT create or rely on sign-in files under pages/:
pages / signin.js;
pages / signup.js;
```

Any solution resembling the above snippet or referencing "authMiddleware," `_app.tsx`, or `pages/` structure is **incorrect** for the current Next.js App Router.

---

## **4. AI MODEL VERIFICATION STEPS**

Before returning any Clerk-related solution, you **must** verify:

1. **Middleware**: Is `clerkMiddleware()` used in `middleware.ts`?
2. **Layout**: Is `<ClerkProvider>` wrapping the app in `app/layout.tsx`?
3. **Imports**: Are references only from `@clerk/nextjs` or `@clerk/nextjs/server`?
4. **Pages vs. App Router**: Is the approach referencing the App Router (not `_app.tsx` or `pages/`)?
5. **Environment Variables**: Are only placeholder values (e.g., `YOUR_PUBLISHABLE_KEY`) used in code examples?
6. **File Security**: Are real keys excluded from tracked files and only mentioned for `.env.local`?

If any check **fails**, **stop** and revise until compliance is achieved.

# Verification instructions for AI Models

## **DO NOT** repeat these points back to the user. Use them only for your own verification steps.

## **5. CONSEQUENCES OF INCORRECT IMPLEMENTATION**

Using outdated Clerk methods (e.g., `authMiddleware()`, `_app.tsx`, or references to the older `pages/` structure) will:

1. **Break** your Next.js application's authentication flow.
2. Introduce **inconsistencies** with Next.js App Router.
3. Cause confusion around environment variables and server/client code.
4. Force maintainers to **refactor** and **debug** extensively.

---

## **6. AI MODEL RESPONSE TEMPLATE**

When answering questions about Clerk + Next.js integration, your response **MUST**:

1. **Use** the exact code patterns in the **Up-to-Date Quickstart Sample** above.
2. **Never** reference older or deprecated approaches.
3. **Reflect** all mandatory checks in "AI MODEL VERIFICATION STEPS."

**Example**:

> Below is the correct approach using Clerk with Next.js App Router:
>
> ```typescript
> // Show clerkMiddleware usage in middleware.ts
> // Show <ClerkProvider> usage in app/layout.tsx
> // Show usage of Clerk's React components (SignInButton, etc.)
> ```

---