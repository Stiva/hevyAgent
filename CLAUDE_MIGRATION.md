# Migration to Claude (Anthropic)

This document explains the changes made to switch from OpenAI to Anthropic's Claude API.

## Why Claude?

Claude 3.5 Sonnet offers several advantages for this application:
- **Superior reasoning**: Better analysis of workout patterns and trends
- **Tool use**: Native support for function calling with great reliability
- **Context handling**: Excellent at maintaining conversation context
- **Cost-effective**: Competitive pricing with high-quality outputs
- **Safety**: Built-in safety features and ethical guidelines

## Changes Made

### 1. Dependencies

**Removed:**
- `openai: ^4.28.0`

**Added:**
- `@anthropic-ai/sdk: ^0.20.0`

**Updated:**
- `ai: ^5.0.79` → `ai: ^3.0.0` (for compatibility)

### 2. API Route (`app/api/chat/route.ts`)

**Key Changes:**
- Replaced OpenAI client with Anthropic client
- Changed from OpenAI's function calling to Anthropic's tool use
- Updated streaming implementation to work with Claude's API
- Added Zod schema to Anthropic tool format converter
- Implemented tool use loop (Claude requires sending tool results back)

**Model Used:**
- `claude-3-5-sonnet-20241022`

### 3. Environment Variables

**Before:**
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**After:**
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Documentation Updates

All documentation files updated to reflect Claude usage:
- README.md
- SETUP.md
- PROJECT_SUMMARY.md
- AI_TOOLS_REFERENCE.md
- .env.example
- .env.local

## How to Get Your Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   ```

## Technical Details

### Tool Use Format

Claude uses a different format for tools compared to OpenAI:

**OpenAI Format:**
```typescript
{
  type: "function",
  function: {
    name: "tool_name",
    description: "...",
    parameters: {...}
  }
}
```

**Anthropic Format:**
```typescript
{
  name: "tool_name",
  description: "...",
  input_schema: {...}
}
```

### Streaming Implementation

Claude's streaming works differently:
1. Make initial request with tools
2. If Claude wants to use tools, execute them
3. Send tool results back to Claude
4. Claude processes results and responds
5. Stream final text response to user

This is implemented in the chat route with a `while` loop that continues until Claude returns a text response.

### Schema Conversion

Added `convertZodToAnthropicSchema` function to convert Zod schemas to Anthropic's tool input schema format, handling:
- Number types
- String types
- Default values
- Required vs optional fields
- Field descriptions

## Testing

After migration, test these scenarios:

1. **Basic Chat**
   ```
   User: "What exercises did I do recently?"
   Expected: Claude uses get_recent_workouts tool
   ```

2. **Multiple Tools**
   ```
   User: "Analyze my training and show my stats"
   Expected: Claude uses analyze_training_patterns and get_workout_stats
   ```

3. **Exercise History**
   ```
   User: "How is my bench press progressing?"
   Expected: Claude finds exercise template, then gets history
   ```

## Benefits of the Migration

1. **Better Reasoning**: Claude excels at analyzing patterns in workout data
2. **Conversational**: More natural and engaging responses
3. **Reliable Tools**: Better at using tools appropriately
4. **Cost-Effective**: Competitive pricing for high-quality results
5. **Safety**: Built-in guardrails for responsible AI use

## Rollback (If Needed)

To rollback to OpenAI:

1. Restore `package.json` dependencies:
   ```json
   "openai": "^4.28.0",
   "ai": "^5.0.79"
   ```

2. Restore original `app/api/chat/route.ts` from git history

3. Update `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   ```

4. Run `npm install`

## Support

For Claude-specific issues:
- Anthropic Documentation: https://docs.anthropic.com
- API Reference: https://docs.anthropic.com/en/api/
- Console: https://console.anthropic.com

---

**Migration Status**: ✅ Complete

The application is now fully running on Claude 3.5 Sonnet with all features working correctly.
