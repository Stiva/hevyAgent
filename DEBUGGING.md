# Debugging Guide - Hevy Training Assistant

## How to Debug Issues

The application now has **extensive logging** to help you identify and fix issues.

### Where to See Errors

**Open your terminal** where you ran `npm run dev`. You'll see detailed logs with emojis:

```
🔵 === NEW CHAT REQUEST ===
📨 Received messages: 1
💬 Last message: What exercises did I do this week?
🛠️  Available tools: get_recent_workouts, get_workout_stats, ...
```

## Common Errors and Solutions

### 1. "Anthropic API key is not configured"

**Error Message:**
```
❌ ANTHROPIC_API_KEY is not set in environment variables
```

**Solution:**

1. Check if `.env.local` exists in your project root
2. Make sure it contains:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```
3. **Restart the dev server** after adding the key:
   ```bash
   # Stop: Press Ctrl+C
   # Start again:
   npm run dev
   ```

**Verify Your API Key:**
- It should start with `sk-ant-api03-`
- Get it from [console.anthropic.com](https://console.anthropic.com/)

---

### 2. "Hevy API key is not configured"

**Error Message:**
```
❌ HEVY_API_KEY is not set in environment variables
```

**Solution:**

1. Add to `.env.local`:
   ```env
   HEVY_API_KEY=98e2e107-fb42-4bad-b1a1-7cb250ea081d
   HEVY_API_BASE_URL=https://api.hevyapp.com
   ```
2. Restart the dev server

---

### 3. Anthropic API Errors

**Check the terminal for:**
```
❌ === STREAMING ERROR ===
Anthropic API Error Details:
  Status: 401
  Type: authentication_error
  Message: Invalid API key
```

**Common Status Codes:**

| Status | Meaning | Solution |
|--------|---------|----------|
| 401 | Invalid API key | Check your ANTHROPIC_API_KEY |
| 403 | Permission denied | Verify your API key has access |
| 429 | Rate limit exceeded | Wait a moment, then try again |
| 500 | Anthropic server error | Wait and retry |
| 529 | Overloaded | Anthropic is busy, retry in a few seconds |

**Solution:**
- Verify your API key at [console.anthropic.com](https://console.anthropic.com/)
- Check you have credits/usage available
- Make sure you copied the full key (starts with `sk-ant-api03-`)

---

### 4. Hevy API Errors

**Check the terminal for:**
```
❌ Tool get_recent_workouts failed: Hevy API Error: Unauthorized
```

**Solutions:**

1. **Check Hevy API Key:**
   - Make sure it's correct in `.env.local`
   - Verify you have Hevy PRO subscription

2. **Test Hevy API Manually:**
   ```bash
   curl -H "api-key: YOUR_HEVY_KEY" https://api.hevyapp.com/v1/workouts/count
   ```

   Should return:
   ```json
   {"workout_count": 123}
   ```

3. **Common Hevy Errors:**
   - `401 Unauthorized` = Invalid API key
   - `403 Forbidden` = Need Hevy PRO subscription
   - `404 Not Found` = Endpoint doesn't exist
   - `500 Server Error` = Hevy is down, try later

---

### 5. Tool Execution Errors

**Look for in terminal:**
```
⚙️  Executing tool: get_recent_workouts
📥 Input: {"count": 5}
❌ Tool get_recent_workouts failed: [error details]
```

**Common Issues:**

**a) Network Errors:**
```
Error: fetch failed
```
Solution: Check your internet connection

**b) Timeout Errors:**
```
Error: Request timeout
```
Solution: Hevy API might be slow, try again

**c) Parse Errors:**
```
Error: Unexpected token in JSON
```
Solution: Hevy API returned unexpected data, report as bug

---

### 6. Client-Side Errors (Browser Console)

**Open Browser DevTools:**
- Chrome/Edge: Press `F12`
- Firefox: Press `F12`
- Safari: Develop → Show Web Inspector

**Look for errors in Console tab:**

```javascript
Error: Failed to fetch
```
**Solution:** Server might not be running, check terminal

```javascript
SyntaxError: Unexpected token
```
**Solution:** Server returned error instead of text, check server logs

---

## Debugging Step-by-Step

### Step 1: Check Environment Variables

```bash
# In your project directory
cat .env.local
```

Should show:
```env
HEVY_API_KEY=98e2e107-fb42-4bad-b1a1-7cb250ea081d
HEVY_API_BASE_URL=https://api.hevyapp.com
ANTHROPIC_API_KEY=sk-ant-api03-[your-key]
```

### Step 2: Check Server is Running

Terminal should show:
```
- ready started server on 0.0.0.0:3000
```

If not, run: `npm run dev`

### Step 3: Try a Simple Question

Ask: **"Hello"**

**Expected Terminal Output:**
```
🔵 === NEW CHAT REQUEST ===
📨 Received messages: 1
💬 Last message: Hello
🛠️  Available tools: get_recent_workouts, ...
🔄 Loop 1: Calling Claude API...
✅ Claude response received
📦 Response blocks: text
📝 Claude provided text response (no tools)
📤 Streaming response: Hello! I'm your Hevy training...
✅ Stream complete
```

### Step 4: Try a Tool-Using Question

Ask: **"How many workouts have I done?"**

**Expected Terminal Output:**
```
🔵 === NEW CHAT REQUEST ===
🔄 Loop 1: Calling Claude API...
🔧 Claude wants to use 1 tool(s): get_workout_stats
  ⚙️  Executing tool: get_workout_stats
  📥 Input: {}
  ✅ Tool get_workout_stats succeeded
  📤 Output: {"totalWorkouts":42,"last30Days":12,...}
🔁 Continuing loop to get Claude's final response...
🔄 Loop 2: Calling Claude API...
📝 Claude provided text response (no tools)
📤 Streaming response: Based on your data, you've...
✅ Stream complete
```

---

## Advanced Debugging

### Enable Detailed Logging

The app already has detailed logging! Just watch your terminal.

### Check API Response

Add this to test Hevy API directly:

**File: `test-hevy.js`**
```javascript
const HEVY_API_KEY = "98e2e107-fb42-4bad-b1a1-7cb250ea081d"

fetch("https://api.hevyapp.com/v1/workouts/count", {
  headers: { "api-key": HEVY_API_KEY }
})
  .then(r => r.json())
  .then(data => console.log("Hevy Response:", data))
  .catch(err => console.error("Hevy Error:", err))
```

Run: `node test-hevy.js`

### Check Anthropic API

**File: `test-claude.js`**
```javascript
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: "sk-ant-api03-your-key-here"
})

anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 100,
  messages: [{ role: "user", content: "Say hi" }]
})
  .then(response => console.log("Claude Response:", response))
  .catch(err => console.error("Claude Error:", err))
```

---

## What the Logs Mean

### Success Indicators
- ✅ Green checkmarks = Success
- 🔵 Blue = New request started
- 📤 Outbox = Data being sent
- 📥 Inbox = Data received

### Error Indicators
- ❌ Red X = Error occurred
- ⚠️ Warning triangle = Warning
- 📛 Error = Specific error message

### Process Flow
- 🔄 Loop = Processing cycle
- 🔧 Wrench = Tool usage
- ⚙️ Gear = Tool executing
- 📝 Document = Text response

---

## Still Having Issues?

### 1. Collect Debug Information

**What to share:**
- Terminal output (full log from request start to error)
- Browser console errors (if any)
- Your question that triggered the error
- `.env.local` contents (hide your actual API keys!)

### 2. Common Quick Fixes

```bash
# Full restart
rm -rf .next
npm run dev

# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev

# Check Node version (should be 18+)
node --version
```

### 3. Verify Everything

**Checklist:**
- [ ] Node.js 18+ installed
- [ ] `npm install` completed without errors
- [ ] `.env.local` exists with both API keys
- [ ] Server running (`npm run dev`)
- [ ] No errors in terminal when server starts
- [ ] Browser can access http://localhost:3000

---

## Example Debug Session

**User asks:** "What did I do yesterday?"

**Terminal shows:**
```
🔵 === NEW CHAT REQUEST ===
📨 Received messages: 1
💬 Last message: What did I do yesterday?
🛠️  Available tools: get_recent_workouts, get_workout_stats, ...

🔄 Loop 1: Calling Claude API...
✅ Claude response received
📦 Response blocks: tool_use

🔧 Claude wants to use 1 tool(s): get_recent_workouts
  ⚙️  Executing tool: get_recent_workouts
  📥 Input: {"count":2}

  ❌ Tool get_recent_workouts failed: Error
  📛 Error message: Hevy API Error: Unauthorized
```

**Diagnosis:** Hevy API key is invalid or missing

**Fix:**
1. Check `.env.local` has correct HEVY_API_KEY
2. Restart server
3. Try again

---

**Now with detailed logging, you can see exactly what's happening at each step!** 🎯
