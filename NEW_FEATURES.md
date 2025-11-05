# New Features Added ✨

## 1. Routine Creation & Update Tools

The AI agent can now **create and update workout routines** in Hevy!

### Create Routine Tool

**What it does:**
- Creates new workout routines in your Hevy account
- Configures exercises with sets, reps, weights
- Supports warmup sets, dropsets, failure sets
- Can organize routines in folders

**Example usage:**
```
User: "Create a Push Day routine with Bench Press 4x8 at 80kg and Overhead Press 3x10 at 40kg"
```

Agent will:
1. Get exercise templates to find Bench Press and Overhead Press IDs
2. Create the routine with specified sets and weights
3. Confirm creation with routine ID and details

**Tool parameters:**
- `title` - Routine name
- `exercises` - Array of exercises with:
  - `exercise_template_id` - Exercise ID from Hevy
  - `sets` - Array of set configurations (type, reps, weight, etc.)
- `notes` - Optional routine notes
- `folder_id` - Optional folder for organization

---

### Update Routine Tool

**What it does:**
- Modifies existing workout routines
- Can change title, exercises, or notes
- Fetches existing routine first to show changes

**Example usage:**
```
User: "Update my Push Day routine to add Tricep Dips 3x12"
```

Agent will:
1. Find the Push Day routine
2. Get current exercises
3. Add Tricep Dips
4. Update the routine
5. Show before/after comparison

**Tool parameters:**
- `routine_id` - ID of routine to update (required)
- `title` - New title (optional)
- `exercises` - New exercise array (optional)
- `notes` - New notes (optional)

---

## 2. Markdown Rendering

Assistant responses now display **properly formatted markdown**!

### What Changed

**Before:**
```
**Bold text** and *italic text* with `code` - all showed as raw text
```

**After:**
- **Bold text** renders bold
- *Italic text* renders italic
- `code` has background highlighting
- Lists are properly formatted
- Headings are styled appropriately

### Supported Markdown

| Element | Syntax | Result |
|---------|--------|--------|
| Bold | `**text**` | **text** |
| Italic | `*text*` | *text* |
| Code | `` `code` `` | `code` with background |
| Headings | `# H1`, `## H2`, `### H3` | Styled headings |
| Lists | `- item` or `1. item` | Bullet/numbered lists |
| Links | `[text](url)` | Clickable links |
| Code blocks | ` ```code``` ` | Formatted code blocks |

### Technical Details

**Package added:** `react-markdown@9.0.1`

**Components styled:**
- Paragraphs with spacing
- Lists with bullets/numbers and indentation
- Code with gray background
- Headings with appropriate sizes
- Links with blue color and hover effects

**File modified:** [components/chat-interface.tsx](components/chat-interface.tsx:95-112)

---

## Files Modified

### 1. [package.json](package.json:26)
```diff
+ "react-markdown": "^9.0.1",
```

### 2. [lib/ai/tools.ts](lib/ai/tools.ts:200-350)
```diff
+ // Tool: Create Workout Routine
+ export const createRoutineTool = { ... }

+ // Tool: Update Workout Routine
+ export const updateRoutineTool = { ... }

export const hevyTools = {
  ...existing tools,
+ create_routine: createRoutineTool,
+ update_routine: updateRoutineTool,
}
```

### 3. [components/chat-interface.tsx](components/chat-interface.tsx:10,91-114)
```diff
+ import ReactMarkdown from "react-markdown"

- <p className="text-sm whitespace-pre-wrap">{message.content}</p>
+ <ReactMarkdown components={{...custom styling...}}>
+   {message.content}
+ </ReactMarkdown>
```

---

## How to Use

### Installing Dependencies

After pulling these changes, run:
```bash
npm install
```

This will install `react-markdown`.

### Testing Routine Creation

1. **Ask to create a routine:**
   ```
   "Create a Pull Day routine with:
   - Pull-ups: 3 sets of 8 reps
   - Barbell Rows: 4 sets of 10 reps at 60kg
   - Face Pulls: 3 sets of 15 reps"
   ```

2. **Agent will:**
   - Find exercise template IDs
   - Create the routine
   - Return success message with routine ID

### Testing Routine Updates

1. **Ask to update:**
   ```
   "Add Bicep Curls 3x12 to my Pull Day routine"
   ```

2. **Agent will:**
   - Find your Pull Day routine
   - Add the exercise
   - Show before/after comparison

### Testing Markdown

Just ask any question - the agent's response will now be beautifully formatted!

**Example response:**
```
Here's your **workout summary** for this week:

### Monday - Push Day
- Bench Press: 4 sets × 8 reps
- Overhead Press: 3 sets × 10 reps

### Wednesday - Pull Day
- Pull-ups: 3 sets × 8 reps
- Rows: 4 sets × 10 reps

*Great consistency this week!*
```

Will render with:
- Bold "workout summary"
- Styled headings for days
- Formatted lists
- Italic emphasis

---

## Benefits

### For Routine Management
✅ Create complete workout programs via conversation
✅ Modify existing routines without opening Hevy app
✅ Configure detailed set parameters (warmup, dropsets, etc.)
✅ Organize routines in folders
✅ Get confirmation of changes

### For User Experience
✅ Responses are easier to read
✅ Information is better organized
✅ Lists and headings improve clarity
✅ Code examples are highlighted
✅ Links are clickable

---

## Example Workflows

### Creating a Complete Program

```
User: "Create a 4-day split program for me"

Agent: *First gets exercise templates, then:*
- Creates "Push Day A" routine
- Creates "Pull Day A" routine
- Creates "Legs Day A" routine
- Creates "Push Day B" routine

Returns formatted summary with all routine IDs
```

### Modifying Training Volume

```
User: "Increase the sets in my Push Day from 3 to 4 sets per exercise"

Agent:
- Fetches current Push Day routine
- Updates all exercises to 4 sets
- Shows before (3 sets) and after (4 sets)
```

---

## Technical Notes

### Error Handling

Both tools include proper error handling:
- Validates exercise template IDs exist
- Checks if routine exists before updating
- Returns detailed error messages
- Logs failures in terminal

### Tool Logging

Terminal shows detailed logs:
```
🔧 Claude wants to use 1 tool(s): create_routine
  ⚙️  Executing tool: create_routine
  📥 Input: {"title":"Push Day","exercises":[...]}
  ✅ Tool create_routine succeeded
  📤 Output: {"success":true,"routine":{"id":"..."}
```

### Markdown Safety

- User messages render as plain text
- Only assistant messages use markdown
- Custom component styling prevents layout issues
- Links open in new tabs with security attributes

---

**Status:** ✅ Ready to use!

Restart your dev server (`npm run dev`) to see the changes in action.
