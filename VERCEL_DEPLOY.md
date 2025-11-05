# Vercel Deployment Guide

## Environment Variables Setup

To deploy this project to Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **ANTHROPIC_API_KEY**
   - Your Anthropic Claude API key
   - Get it from: https://console.anthropic.com/
   - Format: `sk-ant-api03-...`

2. **HEVY_API_KEY**
   - Your Hevy API key
   - Get it from: https://api.hevyapp.com/docs/
   - Format: UUID format

3. **HEVY_API_BASE_URL** (Optional)
   - Default: `https://api.hevyapp.com`
   - Only needed if you want to override the default

### How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Select all (Production, Preview, Development)
4. Repeat for `HEVY_API_KEY` and `HEVY_API_BASE_URL` (if needed)
5. Click **Save**

### After Adding Environment Variables

1. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Select **Redeploy**

Or push a new commit to trigger a new deployment.

## Build Configuration

The project is configured for Next.js 14 with:
- Node.js runtime (required for Anthropic SDK)
- TypeScript compilation
- Automatic environment variable injection

## Troubleshooting

### Build Fails with "API key not configured"
- Ensure all environment variables are set in Vercel
- Check that they're available for all environments (Production, Preview, Development)
- Redeploy after adding variables

### Runtime Errors
- Check Vercel function logs in the dashboard
- Verify API keys are valid and have proper permissions
- Ensure the API keys are not expired

### Type Errors
- All TypeScript errors should be resolved in the latest build
- If you see new type errors, ensure `@types/node` is installed

