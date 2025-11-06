# Setup Checklist

This guide will help you set up authentication for the Hevy Training Assistant application.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Neon PostgreSQL database created
- [ ] Google Cloud Console account
- [ ] SMTP email service (for magic links)
- [ ] Vercel account (for deployment)

## 1. Database Setup

### 1.1 Create Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)

### 1.2 Run Database Migration
```bash
# Pull environment variables from Vercel (if already deployed)
vercel env pull .env.local

# Or manually set DATABASE_URL in .env.local
echo "DATABASE_URL=your-neon-connection-string" >> .env.local

# Run migration
npx drizzle-kit push
```

### 1.3 Verify Database Setup
```bash
# Run the verification script
npx tsx scripts/verify-db.ts
```

Expected output:
- ✅ All 4 tables exist (users, accounts, sessions, verification_tokens)
- ✅ Database write permissions work
- Tables may be empty initially (normal)

## 2. Google OAuth Setup

### 2.1 Create OAuth Application
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Choose "Web application"

### 2.2 Configure Redirect URIs
Add ALL of these URLs to "Authorized redirect URIs":

**Local Development:**
```
http://localhost:3000/api/auth/callback/google
```

**Production Vercel:**
```
https://your-app.vercel.app/api/auth/callback/google
```

**Preview Deployments:**
You need to add each preview URL individually:
```
https://your-app-[hash].vercel.app/api/auth/callback/google
```

⚠️ **Important**: Every time you create a new preview deployment, you must add its URL to Google Cloud Console.

### 2.3 Copy Credentials
After creating the OAuth client:
1. Copy the **Client ID**
2. Copy the **Client Secret**
3. Save these for the next step

## 3. Email Provider Setup (Optional)

For magic link authentication, you need an SMTP server.

### Option A: Gmail
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Generate a new app password
3. Use these settings:
   ```
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### Option B: SendGrid
1. Create a SendGrid account
2. Generate an API key
3. Use these settings:
   ```
   EMAIL_SERVER_HOST=smtp.sendgrid.net
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=apikey
   EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=your-verified-sender@example.com
   ```

### Option C: Resend
1. Create a Resend account
2. Generate an API key
3. Use these settings:
   ```
   EMAIL_SERVER_HOST=smtp.resend.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=resend
   EMAIL_SERVER_PASSWORD=your-resend-api-key
   EMAIL_FROM=onboarding@resend.dev
   ```

## 4. Environment Variables

### 4.1 Local Development (.env.local)
Create a `.env.local` file with:

```bash
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# NextAuth
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Email Provider (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Hevy API
HEVY_API_KEY=your-hevy-api-key
```

### 4.2 Generate AUTH_SECRET
```bash
# Generate a secure random string
openssl rand -base64 32
```

Copy the output and use it as `AUTH_SECRET`.

### 4.3 Vercel Environment Variables
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable from above
4. Set the environment scope:
   - Production: ✅
   - Preview: ✅
   - Development: ✅

**Important Variables for Vercel:**
- `DATABASE_URL` - Your Neon connection string
- `AUTH_SECRET` - Must be the same across all environments
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `EMAIL_SERVER_*` - All email-related variables (if using magic links)

## 5. Testing Authentication

### 5.1 Test Locally
```bash
npm run dev
```

1. Navigate to http://localhost:3000
2. Click "Sign In"
3. Try Google OAuth
4. Try Email magic link (if configured)
5. After successful login, you should be redirected to `/dashboard`

### 5.2 Verify Database
After logging in, run the verification script again:
```bash
npx tsx scripts/verify-db.ts
```

You should now see:
- `users`: 1 record (your account)
- `accounts`: 1+ records (OAuth connections)
- `sessions` or JWT tokens depending on configuration

### 5.3 Test Vercel Deployment
1. Push your code to GitHub
2. Vercel will automatically deploy
3. Visit your production URL
4. Test authentication again

## 6. Troubleshooting

### Error: `redirect_uri_mismatch`
**Cause**: The redirect URI is not registered in Google Cloud Console.

**Solution**:
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth client
3. Add the exact URL shown in the error message to "Authorized redirect URIs"
4. Wait 5 minutes for changes to propagate
5. Try again

### Error: `/login?error=Configuration`
**Possible causes**:
1. Missing or incorrect `AUTH_SECRET`
2. Database connection issues
3. Missing environment variables
4. Adapter cannot write to database

**Solutions**:
1. Verify `AUTH_SECRET` is set in Vercel
2. Run `npx tsx scripts/verify-db.ts` to check database
3. Check Vercel logs for specific error messages
4. Ensure DATABASE_URL has write permissions

### Error: `Failed to send magic link`
**Possible causes**:
1. Incorrect SMTP credentials
2. Email provider blocking the connection
3. Missing EMAIL_FROM address

**Solutions**:
1. Test SMTP credentials with a mail client
2. Verify EMAIL_SERVER_PASSWORD is correct (use app password for Gmail)
3. Check that EMAIL_FROM is a verified sender
4. Review Vercel function logs for specific SMTP errors

### Error: `MIDDLEWARE_INVOCATION_FAILED`
**Cause**: Middleware trying to use Node.js-only features in Edge Runtime.

**Solution**: This should be fixed in the current setup. The configuration is split:
- `auth.config.ts` - Edge-compatible (used by middleware)
- `lib/auth.ts` - Full Node.js configuration (includes Email provider)

### Users Can Access Dashboard Without Login
**Cause**: Dashboard page not wrapped with protection.

**Solution**: Verify `app/dashboard/page.tsx` has:
```typescript
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Dashboard content */}
    </ProtectedRoute>
  )
}
```

### Empty Database Tables After Login Attempt
**Cause**: Authentication failing before user creation.

**Solutions**:
1. Check Vercel function logs during login attempt
2. Verify DATABASE_URL connection string is correct
3. Ensure database has write permissions
4. Run `npx tsx scripts/verify-db.ts` to test write access
5. Check if database user has necessary privileges

## 7. Verification Checklist

After completing setup, verify:

- [ ] `npx tsx scripts/verify-db.ts` passes all checks
- [ ] Can sign in with Google OAuth locally
- [ ] Can sign in with Email magic link locally (if configured)
- [ ] Redirected to `/dashboard` after login
- [ ] Cannot access `/dashboard` when logged out
- [ ] User record appears in database after first login
- [ ] Can sign out successfully
- [ ] Can sign in with Google OAuth on Vercel
- [ ] All Vercel environment variables are set
- [ ] Vercel logs show no errors during authentication

## 8. Getting Help

If you're still experiencing issues:

1. **Check Vercel Logs**:
   ```bash
   vercel logs --follow
   ```

2. **Run Database Verification**:
   ```bash
   npx tsx scripts/verify-db.ts
   ```

3. **Review Error Messages**:
   - Check the browser console for client-side errors
   - Check Vercel function logs for server-side errors

4. **Common Environment Variable Issues**:
   - Verify all variables are set in Vercel (not just locally)
   - Ensure no trailing spaces in variable values
   - Check that AUTH_SECRET is the same in all environments
   - Verify DATABASE_URL uses the correct connection string

5. **Google OAuth Issues**:
   - Verify redirect URIs match exactly (including protocol http/https)
   - Wait 5 minutes after updating OAuth settings
   - Try incognito mode to avoid cached credentials
