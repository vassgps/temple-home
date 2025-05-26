"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-amber-50">
      <div className="w-full max-w-md p-8 space-y-8 text-center bg-white rounded-lg shadow-md">
        <WifiOff className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-2xl font-bold">You're Offline</h1>
        <p className="text-gray-600">
          It looks like you're currently offline. Please check your internet connection and try again.
        </p>
        <div className="space-y-4">
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
