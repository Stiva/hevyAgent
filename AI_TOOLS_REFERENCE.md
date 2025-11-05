# AI Agent Tools Reference

Quick reference for the 6 AI tools available to analyze your Hevy workout data.

## Tool 1: get_recent_workouts

**Purpose**: Fetch your most recent workout sessions

**Parameters**:
- `count` (number, 1-20): Number of workouts to retrieve (default: 5)

**Returns**:
- Workout title and date
- Duration of each workout
- Exercises performed
- Sets, reps, and weights for each exercise

**Example Questions**:
- "What did I do in my last 5 workouts?"
- "Show me my recent training sessions"
- "What exercises did I do this week?"

---

## Tool 2: get_workout_stats

**Purpose**: Get high-level workout statistics

**Parameters**: None

**Returns**:
- Total workouts completed (all time)
- Workouts in last 30 days
- Average workouts per week

**Example Questions**:
- "How many workouts have I done?"
- "What are my overall workout stats?"
- "How often do I train per week?"

---

## Tool 3: get_exercise_history

**Purpose**: Track progression for a specific exercise

**Parameters**:
- `exerciseTemplateId` (string): Exercise ID from Hevy
- `days` (number, 7-365): Days of history (default: 30)

**Returns**:
- Total sessions for that exercise
- Date and workout for each session
- Max weight and total volume per session
- Number of sets

**Example Questions**:
- "How is my bench press progressing?"
- "Show me my squat history for the last 60 days"
- "Track my deadlift improvement"

**Note**: The AI will first need to find the exercise template ID, then fetch history

---

## Tool 4: get_routines

**Purpose**: View your saved workout routines

**Parameters**:
- `count` (number, 1-20): Number of routines to retrieve (default: 10)

**Returns**:
- Routine titles
- Exercises in each routine
- Number of sets per exercise

**Example Questions**:
- "What routines do I have saved?"
- "Show me my workout programs"
- "What's in my Push routine?"

---

## Tool 5: analyze_training_patterns

**Purpose**: Comprehensive training pattern analysis

**Parameters**:
- `days` (number, 7-90): Days to analyze (default: 30)

**Returns**:
- Total workouts in period
- Active training days vs rest days
- Average workouts per week
- Top 5 most frequent exercises
- Consistency percentage

**Example Questions**:
- "Analyze my training for the last month"
- "What are my training patterns?"
- "How consistent have I been?"
- "What exercises do I do most?"

---

## Tool 6: get_exercise_templates

**Purpose**: Browse available exercises in Hevy

**Parameters**: None

**Returns**:
- First 50 exercises from library
- Exercise type (weight_reps, duration, etc.)
- Muscle group classification

**Example Questions**:
- "What exercises are available?"
- "Show me chest exercises"
- "What back exercises can I do?"

---

## How the AI Uses These Tools

The AI agent will:

1. **Understand your question** in natural language
2. **Select appropriate tools** to gather data
3. **Execute multiple tools** if needed
4. **Analyze the results** with fitness expertise
5. **Provide personalized insights** based on your data

## Example Multi-Tool Interactions

**Question**: "How has my training been this month and am I making progress on squats?"

**Tools Used**:
1. `analyze_training_patterns` (last 30 days)
2. `get_exercise_history` (squats, 30 days)

**Response**: Detailed analysis of:
- Overall training frequency
- Rest day patterns
- Squat progression with specific weights
- Recommendations for improvement

---

## Tips for Better Interactions

### Be Specific
- ✅ "Show my bench press progress for last 2 months"
- ❌ "How am I doing?"

### Use Time Periods
- ✅ "Analyze my training for the last 30 days"
- ❌ "How's my training?"

### Ask About Specific Exercises
- ✅ "How is my deadlift progressing?"
- ❌ "Am I getting stronger?"

### Request Comparisons
- ✅ "Compare my workout frequency this month vs last month"
- ✅ "Did I do more volume this week than last week?"

---

## Common Use Cases

### Weekly Review
"Analyze my training patterns for the last 7 days and show me what exercises I did"

### Progress Check
"Show me my bench press, squat, and deadlift progress for the last 60 days"

### Planning
"What routines do I have? And how many rest days did I take last week?"

### Consistency Tracking
"Analyze my training consistency for the last 90 days"

### Exercise Discovery
"What are the most common exercises I do? And what other exercises are available for the same muscle groups?"

---

## Understanding the Data

### Workout Metrics
- **Volume**: Sets × Reps × Weight
- **Frequency**: Workouts per week
- **Consistency**: Active days / Total days
- **Intensity**: Weight lifted, RPE values

### Time Periods
- **Week**: 7 days
- **Month**: 30 days
- **Quarter**: 90 days

### Exercise Types
- **weight_reps**: Traditional strength training
- **duration**: Timed exercises (planks, etc.)
- **distance_duration**: Running, rowing, etc.
- **weight_distance**: Weighted carries

---

## Technical Notes

- All dates are in ISO 8601 format
- Weights are in kilograms
- Distances in meters
- Durations in seconds
- RPE scale is 1-10

---

**Remember**: The AI is your personal training coach. Ask questions naturally, and it will use these tools to provide data-driven insights and recommendations!
