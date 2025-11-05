# MCP Server Setup

This project is configured to use Model Context Protocol (MCP) servers to enhance AI capabilities.

## Context7 MCP Server

Context7 provides up-to-date, version-specific documentation and code examples for libraries directly in your AI assistant's context.

### Setup for Cursor

1. **Get Context7 API Key**
   - Visit [https://context7.com](https://context7.com) to get your API key
   - Or use without an API key (limited functionality)

2. **Configure in Your Project**

   The MCP configuration is already set up in `.cursor/mcp.json`:
   ```json
   {
     "mcpServers": {
       "context7": {
         "command": "npx",
         "args": ["-y", "@upstash/context7-mcp"],
         "env": {
           "CONTEXT7_API_KEY": ""
         }
       }
     }
   }
   ```

3. **Add Your API Key (Optional)**

   If you have a Context7 API key, you can either:

   **Option A: Add to .env.local**
   ```bash
   CONTEXT7_API_KEY=your_api_key_here
   ```

   Then update `.cursor/mcp.json` to reference it:
   ```json
   "env": {
     "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
   }
   ```

   **Option B: Add directly to mcp.json**
   ```json
   "env": {
     "CONTEXT7_API_KEY": "your_api_key_here"
   }
   ```

   > ⚠️ If using Option B, make sure `.cursor/mcp.json` is in `.gitignore` to avoid committing your API key!

4. **Restart Cursor**
   - Close and reopen Cursor for the changes to take effect
   - The Context7 MCP server will now be available

### Setup for Claude Desktop

If you're using Claude Desktop instead of Cursor, add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Config file locations:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### Setup for VS Code

Add this to your VS Code MCP settings:

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### What Does Context7 Provide?

- **Up-to-date documentation** for npm packages and libraries
- **Version-specific examples** that match your dependencies
- **Code snippets** and usage examples
- **API references** directly in your AI context

### Usage

Once configured, you can ask your AI assistant questions like:
- "Show me the latest Next.js 14 API route examples"
- "How do I use the latest features of React 18?"
- "What's the correct syntax for Tailwind CSS flexbox?"

The AI will have access to current, accurate documentation through Context7.

### Requirements

- Node.js >= v18.0.0
- Internet connection for fetching documentation

### Troubleshooting

**MCP server not connecting:**
1. Make sure Node.js v18+ is installed: `node --version`
2. Try running manually: `npx -y @upstash/context7-mcp`
3. Check that your IDE has been restarted after adding the configuration
4. Verify the configuration file syntax is correct (valid JSON)

**Rate limiting:**
- Without an API key, Context7 has rate limits
- Get a free API key from [https://context7.com](https://context7.com) for higher limits

### Alternative Installation with Smithery

You can also install using Smithery:

```bash
npx -y @smithery/cli@latest install @upstash/context7-mcp --client cursor
```

This will automatically configure the MCP server for your editor.

## Other MCP Servers

You can add more MCP servers by adding them to `.cursor/mcp.json`. Popular options include:
- **Filesystem MCP** - for file operations
- **Git MCP** - for git operations
- **Database MCP** - for database queries
- **Brave Search MCP** - for web search capabilities

See [https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) for more MCP servers.
