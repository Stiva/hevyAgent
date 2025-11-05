# 🔍 Debug Your Error NOW

## Quick Steps to Find the Problem

### 1. Look at Your Terminal (Where `npm run dev` is running)

You should see detailed logs with emojis like this:

```
🔵 === NEW CHAT REQUEST ===
📨 Received messages: 1
💬 Last message: What exercises did I do?
```

**If you see ❌ red X marks, that's your error!**

---

### 2. Most Common Errors

#### Error: "ANTHROPIC_API_KEY is not set"

**Terminal shows:**
```
❌ Missing ANTHROPIC_API_KEY
```

**Fix:**
1. Open `.env.local` file
2. Make sure this line exists:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
3. **Stop server:** Press `Ctrl+C`
4. **Restart:** Run `npm run dev` again

---

#### Error: Anthropic API Authentication Failed

**Terminal shows:**
```
❌ === STREAMING ERROR ===
Anthropic API Error Details:
  Status: 401
  Message: Invalid API key
```

**Fix:**
- Your API key might be wrong or expired
- Check at [console.anthropic.com](https://console.anthropic.com/)
- Copy a fresh key and update `.env.local`
- Restart server

---

#### Error: Hevy API Failed

**Terminal shows:**
```
❌ Tool get_recent_workouts failed: Hevy API Error
```

**Possible Causes:**
1. **No Hevy PRO subscription** - You need Hevy PRO
2. **Wrong API key** - Check `.env.local`
3. **Hevy servers down** - Try later

**Quick Test:**
```bash
curl -H "api-key: YOUR_HEVY_API_KEY" https://api.hevyapp.com/v1/workouts/count
```

Should return: `{"workout_count": some_number}`

---

### 3. Copy Your Terminal Output

**Select and copy everything from:**
```
🔵 === NEW CHAT REQUEST ===
```

**To the error line:**
```
❌ === CHAT API ERROR ===
[error details]
```

This will show **exactly** what went wrong!

---

## What to Look For in Terminal

### ✅ Good Signs (Working)
```
🔵 === NEW CHAT REQUEST ===
📨 Received messages: 1
💬 Last message: Hello
🔄 Loop 1: Calling Claude API...
✅ Claude response received
📝 Claude provided text response
📤 Streaming response: Hello! I'm...
✅ Stream complete
```

### ❌ Bad Signs (Errors)
```
🔵 === NEW CHAT REQUEST ===
❌ Missing ANTHROPIC_API_KEY     ← API key problem
```

```
🔄 Loop 1: Calling Claude API...
❌ === STREAMING ERROR ===        ← Claude API problem
Anthropic API Error Details:
  Status: 401                    ← Invalid API key
```

```
⚙️  Executing tool: get_recent_workouts
❌ Tool get_recent_workouts failed  ← Hevy API problem
📛 Error message: Unauthorized      ← Check Hevy key
```

---

## Emergency Checklist

Run through this quickly:

### Check 1: Environment File Exists
```bash
cat .env.local
```

Should show:
```env
HEVY_API_KEY=your_hevy_api_key_here
HEVY_API_BASE_URL=https://api.hevyapp.com
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Check 2: Server is Running
Terminal should show:
```
- ready started server on 0.0.0.0:3000
```

### Check 3: Test Simple Request
In chat, type: **"Hello"**

Should see in terminal:
```
✅ Claude response received
📤 Streaming response: Hello!
```

---

## Restart Everything (Nuclear Option)

If nothing else works:

```bash
# Stop the server (Ctrl+C)

# Delete build cache
rm -rf .next

# Restart
npm run dev

# Try again
```

---

## Copy This for Help

If you need help, copy this info:

**1. Your Terminal Output:**
```
[Paste everything from the terminal here]
```

**2. Your Question:**
```
What I asked: "What exercises did I do?"
```

**3. Environment Check:**
```bash
# Run this and paste output:
ls -la .env.local
head -3 .env.local  # Don't share actual key values!
```

**4. Node Version:**
```bash
node --version
npm --version
```

---

## Right Now: Do This

1. **Open your terminal** where `npm run dev` is running
2. **Ask a question** in the chat
3. **Watch the terminal** for logs
4. **Look for ❌** red error marks
5. **Read the error message** after the ❌
6. **Apply the fix** from this guide
7. **Restart server** if you changed `.env.local`

**The terminal logs will tell you exactly what's wrong!** 🎯
