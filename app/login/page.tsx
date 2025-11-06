import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Dumbbell, Loader2 } from "lucide-react"
import Link from "next/link"
import LoginForm from "./LoginForm"

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto animate-pulse" />
      <div className="space-y-2">
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Hevy Training Assistant</h1>
          </div>
          <p className="text-muted-foreground">Sign in to access your workout data</p>
        </div>

        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Back to home
          </Link>
        </div>
      </Card>
    </div>
  )
}
