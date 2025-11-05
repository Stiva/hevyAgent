"use client"

import { useChat } from "@/lib/hooks/use-chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Loader2, Dumbbell, User } from "lucide-react"
import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

export const ChatInterface = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat()

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-lg border shadow-sm">
      {/* Chat Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">Hevy Training Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Ask me about your workouts, progress, and training schedule
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">
                  Welcome to Your Training Assistant
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  I can help you analyze your workouts and improve your training
                </p>
              </div>
              <div className="grid gap-2 max-w-md mx-auto mt-6">
                <div className="text-left text-sm bg-slate-50 p-3 rounded-md">
                  <strong>Try asking:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>What exercises did I do this week?</li>
                    <li>How is my bench press progressing?</li>
                    <li>Analyze my training patterns for the last month</li>
                    <li>What are my most frequent exercises?</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Dumbbell className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="text-sm prose prose-sm max-w-none prose-slate">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="ml-2">{children}</li>,
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                        code: ({ children }) => <code className="bg-slate-200 px-1 py-0.5 rounded text-xs">{children}</code>,
                        pre: ({ children }) => <pre className="bg-slate-200 p-2 rounded mb-2 overflow-x-auto">{children}</pre>,
                        a: ({ children, href }) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-slate-200">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Dumbbell className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-slate-100 rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your workouts..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
