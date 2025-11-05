import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, MessageSquare, TrendingUp, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Dumbbell className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">
              Hevy Training Assistant
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered workout companion. Analyze your training data, get personalized recommendations, and optimize your fitness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border space-y-3">
            <MessageSquare className="w-10 h-10 text-blue-600" />
            <h3 className="font-semibold text-lg">Chat with Your Data</h3>
            <p className="text-sm text-muted-foreground">
              Ask questions about your workouts, exercises, and training patterns in natural language.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border space-y-3">
            <TrendingUp className="w-10 h-10 text-green-600" />
            <h3 className="font-semibold text-lg">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your strength gains, volume trends, and workout consistency over time.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border space-y-3">
            <Calendar className="w-10 h-10 text-purple-600" />
            <h3 className="font-semibold text-lg">Smart Planning</h3>
            <p className="text-sm text-muted-foreground">
              Get AI-powered schedule recommendations based on your training history and goals.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Dumbbell className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Powered by Hevy API & Claude AI • Built with Next.js</p>
        </div>
      </div>
    </main>
  )
}
