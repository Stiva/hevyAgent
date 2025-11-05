# Quick Start Guide

## You're Almost There! 🚀

Your Hevy Training Assistant is configured and ready. Just follow these 2 simple steps:

### Step 1: Install Dependencies

Open your terminal in this directory and run:

```bash
npm install
```

This will install:
- ✅ Anthropic Claude SDK
- ✅ Next.js and React
- ✅ All UI components
- ✅ TypeScript and other tools

**Expected output:** You'll see packages being downloaded and installed. This may take 1-2 minutes.

### Step 2: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### Step 3: Open the App

Visit [http://localhost:3000](http://localhost:3000) in your browser.

Click **"Go to Dashboard"** and start chatting with your workout data!

---

## ✅ Your Configuration is Ready

- **Hevy API Key:** Already configured
- **Anthropic API Key:** Already configured
- **All code files:** Complete and working

---

## Try These Questions

Once you're in the dashboard, try asking:

1. **"What exercises did I do this week?"**
   - Claude will fetch your recent workouts

2. **"Analyze my training patterns for the last 30 days"**
   - See workout frequency, rest days, top exercises

3. **"How is my bench press progressing?"**
   - Track strength gains over time

4. **"Show me my workout statistics"**
   - Total workouts, weekly averages, etc.

---

## Troubleshooting

### Port 3000 Already in Use?

Run on a different port:
```bash
PORT=3001 npm run dev
```

### Dependencies Not Installing?

Make sure you have Node.js installed:
```bash
node --version
```

Should show v18.0.0 or higher. If not, download from [nodejs.org](https://nodejs.org/).

### Build Errors?

1. Delete `node_modules` and `.next`:
   ```bash
   rm -rf node_modules .next
   ```

2. Reinstall:
   ```bash
   npm install
   ```

3. Try again:
   ```bash
   npm run dev
   ```

---

## What's Included

✅ **Claude 3.5 Sonnet AI** - Advanced reasoning for workout analysis
✅ **6 Analysis Tools** - Recent workouts, stats, history, patterns, routines, templates
✅ **Streaming Responses** - Real-time chat experience
✅ **Beautiful UI** - Modern, responsive design
✅ **Type-Safe** - Full TypeScript support
✅ **Hevy Integration** - Direct access to your workout data

---

## Need Help?

- **Hevy API Issues:** Check [api.hevyapp.com/docs](https://api.hevyapp.com/docs/)
- **Claude API Issues:** Check [docs.anthropic.com](https://docs.anthropic.com/)
- **Next.js Issues:** Check [nextjs.org/docs](https://nextjs.org/docs/)

---

**Ready? Run `npm install` and let's go!** 💪
