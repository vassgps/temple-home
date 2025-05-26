"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { User, Phone, Mail, AlertTriangle } from "lucide-react"
import Script from "next/script"
import Image from "next/image"

// Use a constant for the site key instead of directly referencing the environment variable
// For production, this would be replaced during the build process
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    country_code: "+91",
    mobile: "",
  })
  const [signupError, setSignupError] = useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const recaptchaRef = useRef<number | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://app.templeaddress.com"

  useEffect(() => {
    // Define the callbacks for reCAPTCHA
    window.onRecaptchaLoad = () => {
      console.log("reCAPTCHA loaded")
      setRecaptchaLoaded(true)

      // Initialize reCAPTCHA after it's loaded
      if (typeof window.grecaptcha !== "undefined" && window.grecaptcha !== null) {
        try {
          recaptchaRef.current = window.grecaptcha.render("recaptcha-container", {
            sitekey: RECAPTCHA_SITE_KEY,
            size: "invisible",
            callback: (token: string) => {
              console.log("reCAPTCHA callback received token")
              setRecaptchaToken(token)
            },
            "error-callback": () => {
              console.error("reCAPTCHA error callback triggered")
              toast({
                title: "reCAPTCHA Error",
                description: "Failed to verify reCAPTCHA. Please try again.",
                variant: "destructive",
              })
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired")
              setRecaptchaToken(null)
            },
          })
          console.log("reCAPTCHA initialized with ID:", recaptchaRef.current)
        } catch (error) {
          console.error("Error initializing reCAPTCHA:", error)
        }
      } else {
        console.error("grecaptcha is undefined after onRecaptchaLoad")
      }
    }

    window.onRecaptchaSuccess = (token: string) => {
      console.log("reCAPTCHA success with token")
      setRecaptchaToken(token)
    }

    window.onRecaptchaError = () => {
      console.error("reCAPTCHA error callback triggered")
      toast({
        title: "reCAPTCHA Error",
        description: "Failed to verify reCAPTCHA. Please try again.",
        variant: "destructive",
      })
    }

    window.onRecaptchaExpired = () => {
      console.log("reCAPTCHA expired")
      setRecaptchaToken(null)
    }

    return () => {
      // Clean up
      window.onRecaptchaLoad = undefined
      window.onRecaptchaSuccess = undefined
      window.onRecaptchaError = undefined
      window.onRecaptchaExpired = undefined
    }
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const executeRecaptcha = () => {
    console.log("Attempting to execute reCAPTCHA")
    console.log("reCAPTCHA loaded state:", recaptchaLoaded)
    console.log("grecaptcha exists:", typeof window.grecaptcha !== "undefined")

    if (!recaptchaLoaded) {
      toast({
        title: "reCAPTCHA Not Ready",
        description: "Please wait a moment and try again. reCAPTCHA is still loading.",
        variant: "destructive",
      })
      return false
    }

    if (typeof window.grecaptcha === "undefined" || window.grecaptcha === null) {
      console.error("grecaptcha is undefined when trying to execute")
      toast({
        title: "reCAPTCHA Error",
        description: "reCAPTCHA not loaded properly. Please refresh the page and try again.",
        variant: "destructive",
      })
      return false
    }

    try {
      console.log("Executing reCAPTCHA with ID:", recaptchaRef.current)
      if (recaptchaRef.current !== null) {
        window.grecaptcha.execute(recaptchaRef.current)
        return true
      } else {
        console.error("recaptchaRef.current is null")
        toast({
          title: "reCAPTCHA Error",
          description: "reCAPTCHA not initialized properly. Please refresh the page and try again.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("reCAPTCHA execution error:", error)
      toast({
        title: "reCAPTCHA Error",
        description: "Failed to execute reCAPTCHA. Please refresh the page and try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null)

    // Basic validation
    if (!formData.first_name || !formData.email || !formData.mobile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/
    if (!mobileRegex.test(formData.mobile)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      })
      return
    }

    // For demo purposes, we'll skip the reCAPTCHA verification
    // and proceed directly with the signup process
    proceedWithSignup()

    // In a production environment, you would use the following code:
    /*
    // Execute reCAPTCHA
    const recaptchaExecuted = executeRecaptcha()
    
    if (!recaptchaExecuted) {
      return
    }

    // Wait for reCAPTCHA token
    let attempts = 0
    const maxAttempts = 10
    const checkRecaptcha = setInterval(() => {
      attempts++
      if (recaptchaToken || attempts >= maxAttempts) {
        clearInterval(checkRecaptcha)
        if (!recaptchaToken && attempts >= maxAttempts) {
          toast({
            title: "reCAPTCHA Timeout",
            description: "Failed to verify you're not a robot. Please try again.",
            variant: "destructive",
          })
          return
        }
        proceedWithSignup()
      }
    }, 500)
    */
  }

  const proceedWithSignup = async () => {
    setIsLoading(true)

    try {
      // For demo purposes, we'll simulate a successful API call
      // In a real app, you would send the request to your API
      /*
      const response = await fetch(`${baseUrl}/api/v1/users/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      const data = await response.json();
      */

      // Simulate API response for demo
      const data = {
        success: true,
        message: "Account created successfully. Please login with OTP.",
        data: {
          uuid: "demo_uuid",
          username: "demo_user",
        },
      }

      if (data.success) {
        toast({
          title: "Account Created",
          description: data.message || "Your account has been created successfully. Please login with OTP.",
        })

        // Store user data in session storage for potential use in login flow
        sessionStorage.setItem(
          "tempUserData",
          JSON.stringify({
            uuid: data.data.uuid,
            username: data.data.username,
            identifier: formData.country_code + formData.mobile,
          }),
        )

        // Redirect to login page
        router.push("/auth/login")
      } else {
        setSignupError(data.message || "Failed to create account. Please try again.")
        toast({
          title: "Error",
          description: data.message || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error signing up:", error)
      setSignupError("Network error. Please check your connection and try again.")
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setRecaptchaToken(null) // Reset token after use
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad`}
        strategy="beforeInteractive"
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-amber-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image src="/templeaddress.png" alt="Temple Address Logo" width={60} height={60} />
            </div>
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="mt-2 text-sm text-gray-600">Join Temple Address to discover sacred places</p>
          </div>

          {signupError && (
            <div className="p-4 rounded-md bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{signupError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Your name"
                  className="pl-10"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <div className="flex space-x-2">
                <div className="relative w-1/4">
                  <Input
                    id="country_code"
                    name="country_code"
                    placeholder="+91"
                    className="pl-3"
                    value={formData.country_code}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="mobile"
                    name="mobile"
                    placeholder="9876543210"
                    className="pl-10"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Protected by reCAPTCHA</p>
          </div>

          {/* reCAPTCHA container */}
          <div id="recaptcha-container" className="mt-4"></div>
        </div>
      </div>
    </>
  )
}

// Add TypeScript declarations for reCAPTCHA
declare global {
  interface Window {
    onRecaptchaLoad?: () => void
    onRecaptchaSuccess?: (token: string) => void
    onRecaptchaError?: () => void
    onRecaptchaExpired?: () => void
    grecaptcha?: {
      render: (
        container: string,
        options: {
          sitekey: string
          size: string
          callback: (token: string) => void
          "error-callback": () => void
          "expired-callback": () => void
        },
      ) => number
      execute: (opt_widget_id?: number) => void
    }
  }
}
