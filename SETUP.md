# Quick Setup Guide

## Getting Started in 5 Minutes

### Step 1: Install Node.js

If you don't have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/) (v18 or higher)
- Verify installation: `node --version`

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- TailwindCSS and Shadcn UI
- Anthropic Claude SDK
- Date utilities and validation libraries

### Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```env
   HEVY_API_KEY=98e2e107-fb42-4bad-b1a1-7cb250ea081d
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

   **Where to get API keys:**
   - **Hevy API**: Already set! (Your key is included)
   - **Anthropic**: Get from [console.anthropic.com](https://console.anthropic.com/)

### Step 4: Run the Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### Step 5: Start Chatting!

1. Navigate to the Dashboard
2. Click "Go to Dashboard" button
3. Start asking questions about your Hevy workouts

## Example First Questions

Try these to get started:
- "What exercises did I do this week?"
- "Show me my workout statistics"
- "Analyze my training patterns for the last 30 days"

## Troubleshooting

### Port 3000 already in use?

Run on a different port:
```bash
PORT=3001 npm run dev
```

### Anthropic API Key Issues?

Make sure:
1. You've created an API key at console.anthropic.com
2. The key is added to `.env.local`
3. You've restarted the dev server

### Hevy API not working?

Verify:
1. You have a Hevy PRO subscription
2. The API key is correct in `.env.local`
3. You've restarted the dev server after adding the key

## Project Structure at a Glance

```
hevyAgent/
├── app/
│   ├── api/chat/          ← AI chat endpoint
│   ├── api/hevy/          ← Hevy API proxy
│   ├── dashboard/         ← Main app page
│   └── page.tsx           ← Landing page
├── components/
│   ├── chat-interface.tsx ← Chat UI
│   └── workout-stats.tsx  ← Statistics panel
├── lib/
│   ├── ai/tools.ts        ← AI agent tools
│   └── hevy-client.ts     ← Hevy API client
└── types/hevy.ts          ← TypeScript types
```

## What's Next?

Once running, you can:
1. Ask questions about your training data
2. Get insights on workout patterns
3. Track exercise progression
4. Receive personalized recommendations

Enjoy training smarter with AI!
