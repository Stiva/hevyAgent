"use client"

import { useState, useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Save, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [configured, setConfigured] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (user) {
      fetchApiKey()
    }
  }, [user])

  const fetchApiKey = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/api-key")
      if (response.ok) {
        const data = await response.json()
        setConfigured(data.configured)
        if (data.apiKey) {
          setApiKey(data.apiKey)
        }
      } else if (response.status === 404) {
        setConfigured(false)
      }
    } catch (error) {
      console.error("Error fetching API key:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/user/api-key", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "API key saved successfully!" })
        setConfigured(true)
        // Mask the key after saving
        if (apiKey.length > 4) {
          setApiKey(apiKey.slice(-4).padStart(apiKey.length, "*"))
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save API key" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving" })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Hevy Training Assistant</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                Hevy API Key
              </label>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your Hevy API key to connect your account. You can get your API key from{" "}
                <a
                  href="https://api.hevyapp.com/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Hevy API documentation
                </a>
                .
              </p>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Hevy API key"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {configured && (
                <p className="text-sm text-muted-foreground mt-2">
                  API key is configured. Enter a new key to update it.
                </p>
              )}
            </div>

            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save API Key
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

