# Hevy Training Assistant

An AI-powered web application that helps you analyze and optimize your workout training data from Hevy. Built with Next.js, TypeScript, and Anthropic's Claude.

## Features

- **Conversational AI Agent**: Chat naturally with your workout data using advanced AI
- **Workout Analysis**: Get insights into your training patterns, frequency, and consistency
- **Exercise History**: Track progression and performance trends for specific exercises
- **Smart Recommendations**: Receive personalized training schedule suggestions
- **Real-time Statistics**: View workout counts, weekly averages, and activity metrics
- **Routine Management**: Access and analyze your saved workout routines

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS, Shadcn UI, Radix UI
- **AI**: Anthropic Claude 3.5 Sonnet with tool use
- **API Integration**: Hevy API with typed TypeScript client
- **Data Validation**: Zod schemas

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
2. **Hevy PRO subscription** (required for API access)
3. **Hevy API Key** - Get from [https://api.hevyapp.com/docs/](https://api.hevyapp.com/docs/)
4. **Anthropic API Key** - Get from [https://console.anthropic.com/](https://console.anthropic.com/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Stiva/hevyAgent.git
   cd hevyAgent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Hevy API Configuration
   HEVY_API_KEY=your_hevy_api_key_here
   HEVY_API_BASE_URL=https://api.hevyapp.com

   # Anthropic Claude API
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

   Replace the placeholder values with your actual API keys.

4. **(Optional) Set up MCP Servers**:
   For enhanced AI capabilities with up-to-date documentation, see [MCP_SETUP.md](MCP_SETUP.md) for configuring Context7 and other MCP servers.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Dashboard

The main dashboard provides:
- **Chat Interface**: Ask questions about your workouts in natural language
- **Statistics Panel**: View your workout metrics and trends
- **Quick Tips**: Get suggestions for questions to ask

### Example Questions

Try asking the AI assistant:
- "What exercises did I do this week?"
- "How is my bench press progressing?"
- "Analyze my training patterns for the last month"
- "What are my most frequent exercises?"
- "How many rest days did I take last week?"
- "Show me my workout consistency"

### AI Agent Capabilities

The AI agent has access to these tools:
1. **get_recent_workouts**: Fetch your recent training sessions
2. **get_workout_stats**: Overall workout statistics and frequency
3. **get_exercise_history**: Track specific exercise progression
4. **get_routines**: Access your saved workout routines
5. **analyze_training_patterns**: Comprehensive training insights
6. **get_exercise_templates**: Browse available exercises

## Project Structure

```
hevyAgent/
├── app/
│   ├── api/
│   │   ├── chat/           # AI chat endpoint
│   │   └── hevy/           # Hevy API proxy routes
│   ├── dashboard/          # Main dashboard page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── chat-interface.tsx  # Chat component
│   └── workout-stats.tsx   # Statistics component
├── lib/
│   ├── ai/
│   │   └── tools.ts        # AI agent tools
│   ├── hevy-client.ts      # Hevy API client
│   └── utils.ts            # Utility functions
├── types/
│   └── hevy.ts             # TypeScript type definitions
└── package.json
```

## API Routes

### Hevy Proxy Endpoints

- `GET /api/hevy/workouts` - Get paginated workouts
- `GET /api/hevy/workouts/[id]` - Get specific workout
- `GET /api/hevy/workouts/count` - Get total workout count
- `POST /api/hevy/workouts` - Create new workout
- `GET /api/hevy/routines` - Get saved routines
- `GET /api/hevy/exercise-templates` - Get exercise library
- `GET /api/hevy/exercise-history/[id]` - Get exercise progression

### Chat Endpoint

- `POST /api/chat` - AI chat with streaming responses

## Development

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Configuration

### Hevy API Client

The Hevy API client is configured in [lib/hevy-client.ts](lib/hevy-client.ts) and uses:
- API key from environment variables
- Base URL: `https://api.hevyapp.com`
- Typed responses with TypeScript interfaces

### AI Agent System

The AI agent system ([lib/ai/tools.ts](lib/ai/tools.ts)) provides:
- Function calling with Zod validation
- Data transformation for better AI understanding
- Error handling and user-friendly responses

## Security Considerations

- **API Keys**: Never commit `.env.local` to version control
- **Environment Variables**: All sensitive data stored in environment variables
- **API Proxy**: Frontend calls backend routes, which proxy to Hevy API
- **Rate Limiting**: Consider implementing rate limiting for production

## Troubleshooting

### "Hevy API key is required" error
- Ensure `.env.local` exists with valid `HEVY_API_KEY`
- Restart the development server after adding environment variables

### Claude API errors
- Verify your Anthropic API key is valid and has sufficient credits
- Check that you have access to Claude 3.5 Sonnet model

### Hevy API returns 401
- Verify you have an active Hevy PRO subscription
- Check that your API key is correct and not expired

## Future Enhancements

Potential features to add:
- Workout visualization charts (using Recharts)
- Training calendar view
- Custom workout creation via AI
- Progress photos integration
- Nutrition tracking integration
- Multi-user support with authentication
- Export reports to PDF
- Mobile responsive improvements

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for personal use. Check Hevy's terms of service for API usage guidelines.

## Acknowledgments

- **Hevy** for providing the workout tracking API
- **Anthropic** for Claude AI and advanced reasoning capabilities
- **Vercel** for Next.js framework
- **Shadcn** for beautiful UI components

## Support

For issues or questions:
1. Check the Hevy API documentation: [https://api.hevyapp.com/docs/](https://api.hevyapp.com/docs/)
2. Review Anthropic's documentation: [https://docs.anthropic.com](https://docs.anthropic.com)
3. Open an issue in this repository

---

Built with love for fitness enthusiasts who want to train smarter, not just harder.
