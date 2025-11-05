import Anthropic, { APIError } from "@anthropic-ai/sdk"
import { hevyTools } from "@/lib/ai/tools"

// Validate environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const HEVY_API_KEY = process.env.HEVY_API_KEY

if (!ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY is not set in environment variables")
  console.error("Please add it to your .env.local file")
}

if (!HEVY_API_KEY) {
  console.error("❌ HEVY_API_KEY is not set in environment variables")
  console.error("Please add it to your .env.local file")
}

// Create Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY || "dummy-key-for-build",
})

// Use Node.js runtime instead of Edge (Anthropic SDK requires Node.js)
export const runtime = "nodejs"

const systemPrompt = `You are a highly knowledgeable and supportive fitness coach with expertise in strength training, workout programming, and exercise science. You have access to the user's complete workout history from Hevy, including their exercises, sets, reps, weights, and training patterns.

Your role is to:
1. Help users understand their training data and progress
2. Provide personalized workout recommendations based on their history
3. Identify patterns, strengths, and areas for improvement
4. Answer questions about their exercises, routines, and performance
5. Suggest schedule optimizations and recovery strategies
6. Motivate and encourage consistent training

When analyzing data:
- Always use the available tools to fetch real workout data
- Provide specific numbers and dates when discussing performance
- Compare current performance to past performance when relevant
- Be encouraging but honest about progress and areas to improve

When making recommendations:
- Base suggestions on the user's actual training history
- Consider their workout frequency, exercise selection, and volume
- Respect progressive overload principles
- Suggest realistic improvements and next steps

Keep your responses conversational, supportive, and data-driven. Use the user's actual workout data to personalize every interaction.`

// Convert Zod schemas to Anthropic tool format
const convertZodToAnthropicSchema = (zodSchema: any): any => {
  const shape = zodSchema._def.shape()
  const properties: Record<string, any> = {}
  const required: string[] = []

  for (const [key, value] of Object.entries(shape)) {
    const field = value as any
    const property: any = {}

    if (field._def.typeName === "ZodNumber") {
      property.type = "number"
      if (field._def.description) {
        property.description = field._def.description
      }
    } else if (field._def.typeName === "ZodString") {
      property.type = "string"
      if (field._def.description) {
        property.description = field._def.description
      }
    } else if (field._def.typeName === "ZodDefault") {
      const innerType = field._def.innerType
      if (innerType._def.typeName === "ZodNumber") {
        property.type = "number"
      } else if (innerType._def.typeName === "ZodString") {
        property.type = "string"
      }
      if (field._def.description || innerType._def.description) {
        property.description = field._def.description || innerType._def.description
      }
    }

    properties[key] = property

    if (!field.isOptional()) {
      required.push(key)
    }
  }

  return {
    type: "object",
    properties,
    required: required.length > 0 ? required : undefined,
  }
}

export async function POST(req: Request) {
  console.log("\n🔵 === NEW CHAT REQUEST ===")

  try {
    // Validate API keys
    if (!ANTHROPIC_API_KEY) {
      console.error("❌ Missing ANTHROPIC_API_KEY")
      return new Response(
        JSON.stringify({
          error: "Configuration Error",
          message: "Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your .env.local file.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    if (!HEVY_API_KEY) {
      console.error("❌ Missing HEVY_API_KEY")
      return new Response(
        JSON.stringify({
          error: "Configuration Error",
          message: "Hevy API key is not configured. Please add HEVY_API_KEY to your .env.local file.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const { messages } = await req.json()
    console.log("📨 Received messages:", messages.length)
    console.log("💬 Last message:", messages[messages.length - 1]?.content?.substring(0, 100))

    // Convert our tool definitions to Anthropic format
    const tools = Object.entries(hevyTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      input_schema: convertZodToAnthropicSchema(tool.parameters),
    }))
    console.log("🛠️  Available tools:", tools.map(t => t.name).join(", "))

    // Prepare messages for Claude
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let continueLoop = true
          let loopCount = 0
          const MAX_LOOPS = 5 // Prevent infinite loops

          while (continueLoop && loopCount < MAX_LOOPS) {
            loopCount++
            console.log(`\n🔄 Loop ${loopCount}: Calling Claude API...`)

            const response = await anthropic.messages.create({
              model: "claude-sonnet-4-5-20250929",
              max_tokens: 4096,
              system: systemPrompt,
              messages: anthropicMessages,
              tools,
            })

            console.log("✅ Claude response received")
            console.log("📦 Response blocks:", response.content.map((b: any) => b.type).join(", "))

            // Check if Claude wants to use tools
            const toolUseBlocks = response.content.filter(
              (block: any) => block.type === "tool_use"
            )

            if (toolUseBlocks.length > 0) {
              console.log(`🔧 Claude wants to use ${toolUseBlocks.length} tool(s):`,
                toolUseBlocks.map((t: any) => t.name).join(", "))

              // Execute all tool calls
              const toolResults = await Promise.all(
                toolUseBlocks.map(async (toolBlock: any) => {
                  const toolFunction = hevyTools[toolBlock.name as keyof typeof hevyTools]
                  if (!toolFunction) {
                    console.error(`❌ Unknown tool: ${toolBlock.name}`)
                    return {
                      type: "tool_result" as const,
                      tool_use_id: toolBlock.id,
                      content: JSON.stringify({ error: `Unknown tool: ${toolBlock.name}` }),
                    }
                  }

                  try {
                    console.log(`  ⚙️  Executing tool: ${toolBlock.name}`)
                    console.log(`  📥 Input:`, JSON.stringify(toolBlock.input))

                    const result = await toolFunction.execute(toolBlock.input)

                    console.log(`  ✅ Tool ${toolBlock.name} succeeded`)
                    console.log(`  📤 Output:`, JSON.stringify(result).substring(0, 200) + "...")

                    return {
                      type: "tool_result" as const,
                      tool_use_id: toolBlock.id,
                      content: JSON.stringify(result),
                    }
                  } catch (error) {
                    console.error(`  ❌ Tool ${toolBlock.name} failed:`, error)
                    const errorMessage = error instanceof Error ? error.message : "Unknown error"
                    console.error(`  📛 Error message:`, errorMessage)

                    return {
                      type: "tool_result" as const,
                      tool_use_id: toolBlock.id,
                      content: JSON.stringify({
                        error: errorMessage,
                      }),
                    }
                  }
                })
              )

              // Add assistant response with tool use to messages
              anthropicMessages.push({
                role: "assistant",
                content: response.content,
              })

              // Add tool results to messages
              anthropicMessages.push({
                role: "user",
                content: toolResults,
              })

              console.log("🔁 Continuing loop to get Claude's final response...")
            } else {
              // No tool use, stream the text response
              console.log("📝 Claude provided text response (no tools)")
              const textBlocks = response.content.filter(
                (block: any) => block.type === "text"
              )

              for (const block of textBlocks) {
                if (block.type === "text") {
                  console.log("📤 Streaming response:", block.text.substring(0, 100) + "...")
                  controller.enqueue(encoder.encode(block.text))
                }
              }
              continueLoop = false
            }
          }

          if (loopCount >= MAX_LOOPS) {
            console.error("⚠️  Max loops reached! Possible infinite loop.")
            controller.enqueue(encoder.encode("\n\n[Error: Maximum tool use iterations reached]"))
          }

          console.log("✅ Stream complete\n")
          controller.close()
        } catch (error) {
          console.error("\n❌ === STREAMING ERROR ===")
          console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error)
          console.error("Error message:", error instanceof Error ? error.message : String(error))

          if (error instanceof Error) {
            console.error("Stack trace:", error.stack)
          }

          if (error instanceof APIError) {
            const apiError = error as APIError
            console.error("Anthropic API Error Details:")
            console.error("  Status:", apiError.status)
            console.error("  Message:", apiError.message)
          }

          console.error("=========================\n")
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("\n❌ === CHAT API ERROR ===")
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("Error message:", error instanceof Error ? error.message : String(error))

    if (error instanceof Error) {
      console.error("Stack trace:", error.stack)
    }

    if (error instanceof APIError) {
      const apiError = error as APIError
      console.error("Anthropic API Error Details:")
      console.error("  Status:", apiError.status)
      console.error("  Message:", apiError.message)
    }

    console.error("========================\n")

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
