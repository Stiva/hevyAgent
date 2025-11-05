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

