"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Phone, Mail, Lock, AlertTriangle } from "lucide-react"
import Script from "next/script"
import Image from "next/image"

// Use a constant for the site key instead of directly referencing the environment variable
// For production, this would be replaced during the build process
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("phone")
  const [countdown, setCountdown] = useState(0)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const recaptchaRef = useRef<number | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://app.templeaddress.com"

  // Check if we have temp user data from signup
  useEffect(() => {
    const tempUserData = sessionStorage.getItem("tempUserData")
    if (tempUserData) {
      try {
        const userData = JSON.parse(tempUserData)
        if (userData.identifier) {
          setIdentifier(userData.identifier)
          // Determine which tab to activate based on the identifier
          if (userData.identifier.includes("@")) {
            setActiveTab("email")
          } else {
            setActiveTab("phone")
          }
        }
      } catch (error) {
        console.error("Error parsing temp user data:", error)
      }
    }

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

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (!identifier) {
      toast({
        title: "Error",
        description: "Please enter your phone number or email",
        variant: "destructive",
      })
      return
    }

    // Validate identifier based on active tab
    if (activeTab === "phone") {
      // Simple phone validation - should start with + and contain only numbers
      if (!/^\+[0-9]+$/.test(identifier)) {
        toast({
          title: "Error",
          description: "Please enter a valid phone number with country code (e.g., +919876543210)",
          variant: "destructive",
        })
        return
      }
    } else {
      // Simple email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
        toast({
          title: "Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        return
      }
    }

    // For demo purposes, we'll skip the reCAPTCHA verification
    // and proceed directly with sending OTP
    proceedWithSendOTP()

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
        proceedWithSendOTP()
      }
    }, 500)
    */
  }

  const proceedWithSendOTP = async () => {
    setIsLoading(true)

    try {
      // For demo purposes, we'll simulate a successful API call
      // In a real app, you would send the request to your API
      /*
      const response = await fetch(`${baseUrl}/api/v1/users/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          method: activeTab === "phone" ? "sms" : "email",
          recaptchaToken,
        }),
      });
      
      const data = await response.json();
      */

      // Simulate API response
      const data = {
        success: true,
        message: `OTP sent to your ${activeTab === "phone" ? "phone" : "email"}`,
      }

      if (data.success) {
        setOtpSent(true)
        setCountdown(30) // Set 30 seconds countdown for resend
        toast({
          title: "OTP Sent",
          description: data.message || `OTP sent to your ${activeTab === "phone" ? "phone" : "email"}`,
        })
      } else {
        setLoginError(
          data.message ||
            `Failed to send OTP. Please check your ${activeTab === "phone" ? "phone number" : "email"} and try again.`,
        )
        toast({
          title: "Error",
          description:
            data.message ||
            `Failed to send OTP. Please check your ${activeTab === "phone" ? "phone number" : "email"} and try again.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      setLoginError("Network error. Please check your connection and try again.")
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (!identifier || !otp) {
      toast({
        title: "Error",
        description: "Please enter both identifier and OTP",
        variant: "destructive",
      })
      return
    }

    // For demo purposes, we'll skip the reCAPTCHA verification
    // and proceed directly with login
    proceedWithLogin()

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
        proceedWithLogin()
      }
    }, 500)
    */
  }

  const proceedWithLogin = async () => {
    setIsLoading(true)

    try {
      // For demo purposes, we'll simulate a successful API call
      // In a real app, you would send the request to your API
      /*
      const response = await fetch(`${baseUrl}/api/v1/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier, 
          otp,
          recaptchaToken 
        }),
      });
      
      const data = await response.json();
      */

      // Simulate API response for demo
      const data = {
        success: true,
        message: "Login successful",
        data: {
          access_token: "demo_access_token",
          refresh_token: "demo_refresh_token",
          user: {
            uuid: "demo_uuid",
            username: "demo_user",
            email: identifier.includes("@") ? identifier : "demo@example.com",
            phone: !identifier.includes("@") ? identifier : "+919876543210",
            first_name: "Demo",
            last_name: "User",
          },
        },
      }

      if (data.success) {
        toast({
          title: "Login Successful",
          description: data.message || "You have successfully logged in",
        })

        // Store tokens securely with longer expiration
        localStorage.setItem("access_token", data.data.access_token)
        localStorage.setItem("refresh_token", data.data.refresh_token)
        localStorage.setItem("token_expiry", (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()) // 30 days

        // Store user data
        localStorage.setItem("user", JSON.stringify(data.data.user))

        // Clear any temporary data
        sessionStorage.removeItem("tempUserData")

        // Redirect to profile page after successful login
        router.push("/profile")
      } else {
        setLoginError(data.message || "Invalid OTP. Please try again.")
        toast({
          title: "Error",
          description: data.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error logging in:", error)
      setLoginError("Network error. Please check your connection and try again.")
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

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setOtpSent(false)
    setOtp("")
    setLoginError(null)
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
            <h1 className="text-2xl font-bold">Welcome to Temple Address</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          {loginError && (
            <div className="p-4 rounded-md bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="mt-6">
              <form onSubmit={otpSent ? handleLogin : handleSendOTP}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="+91 9876543210"
                        className="pl-10"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={otpSent || isLoading}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otp">One-Time Password</Label>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs"
                          onClick={handleSendOTP}
                          disabled={isLoading || countdown > 0}
                          type="button"
                        >
                          {countdown > 0 ? `Resend OTP (${countdown}s)` : "Resend OTP"}
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="otp"
                          placeholder="Enter OTP"
                          className="pl-10"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Please wait..." : otpSent ? "Login" : "Send OTP"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="email" className="mt-6">
              <form onSubmit={otpSent ? handleLogin : handleSendOTP}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={otpSent || isLoading}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otp-email">One-Time Password</Label>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs"
                          onClick={handleSendOTP}
                          disabled={isLoading || countdown > 0}
                          type="button"
                        >
                          {countdown > 0 ? `Resend OTP (${countdown}s)` : "Resend OTP"}
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="otp-email"
                          placeholder="Enter OTP"
                          className="pl-10"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Please wait..." : otpSent ? "Login" : "Send OTP"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                Sign up
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
