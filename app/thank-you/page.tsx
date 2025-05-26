import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="container flex items-center justify-center min-h-[70vh] px-4 py-12 mx-auto">
      <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Thank You!</h1>
        <p className="mb-6 text-gray-700">
          Your message has been successfully sent. We'll get back to you as soon as possible.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90">Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}
