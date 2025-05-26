"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Share2, AlertTriangle, Wallet, History, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface UserProfile {
  id: number
  uuid: string
  username: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  country_code: string
  is_active: boolean
  is_deleted: boolean
}

interface Transaction {
  id: number
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
}

export default function WalletPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://app.templeaddress.com"

  useEffect(() => {
    // Set page title and meta description
    document.title = "Wallet - Temple Address"

    const metaDescription = document.createElement("meta")
    metaDescription.name = "description"
    metaDescription.content =
      "Manage your Temple Address wallet, view your balance, and earn rewards by referring friends to join Temple Address."

    // Remove existing description if any
    const existingDescription = document.querySelector('meta[name="description"]')
    if (existingDescription) {
      existingDescription.remove()
    }

    document.head.appendChild(metaDescription)

    // Get user data from localStorage
    const userData = getCurrentUser()
    if (userData) {
      setProfile(userData)
    } else {
      // Use mock data if no user data is found
      setProfile({
        id: 2,
        uuid: "b4a54578-f4fa-4e31-ae36-13ea92e99f36",
        username: "anand",
        first_name: "Anand",
        last_name: "Vm",
        email: "anand@vass.co.in",
        mobile: "9809585792",
        country_code: "+91",
        is_active: true,
        is_deleted: false,
      })
    }

    // Set mock wallet balance and transactions
    setWalletBalance(250.75)
    setTransactions([
      {
        id: 1,
        type: "credit",
        amount: 100,
        description: "Referral bonus - user123",
        date: "2025-05-01T10:30:00",
      },
      {
        id: 2,
        type: "credit",
        amount: 150,
        description: "Welcome bonus",
        date: "2025-04-28T14:15:00",
      },
      {
        id: 3,
        type: "credit",
        amount: 50,
        description: "Referral bonus - user456",
        date: "2025-04-25T09:45:00",
      },
      {
        id: 4,
        type: "debit",
        amount: 49.25,
        description: "Temple donation - Guruvayur Temple",
        date: "2025-04-20T16:20:00",
      },
    ])

    setIsLoading(false)

    // Cleanup function
    return () => {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && metaDesc.getAttribute("content")?.includes("Temple Address wallet")) {
        metaDesc.remove()
      }
    }
  }, [baseUrl, router, toast])

  const copyReferralLink = () => {
    if (!profile) return

    const referralLink = `${window.location.origin}/signup?ref=${profile.username}`
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        })
      })
  }

  const shareReferralLink = () => {
    if (!profile) return

    const referralLink = `${window.location.origin}/signup?ref=${profile.username}`
    if (navigator.share) {
      navigator
        .share({
          title: "Join Temple Address with my referral",
          text: "Use my referral link to join Temple Address and we both get rewards!",
          url: referralLink,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      copyReferralLink()
    }
  }

  // Format date for transactions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <div className="mt-8">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <div className="p-8 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
          <h2 className="mt-4 text-2xl font-bold">Unable to Load Wallet</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold">Wallet</h1>

      <div className="mt-8">
        {/* Wallet Card */}
        <Card className="overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="flex items-center">
                <div className="p-4 mr-6 bg-white rounded-full">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-medium">Wallet Balance</h2>
                  <p className="text-4xl font-bold">₹{walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <Button className="bg-white text-primary hover:bg-white/90">Add Money</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View all your wallet transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center p-4 border rounded-lg">
                        <div
                          className={`p-3 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowUpRight
                              className={`w-5 h-5 ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                            />
                          ) : (
                            <ArrowDownRight
                              className={`w-5 h-5 ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 ml-4">
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                        <div
                          className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <History className="w-16 h-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No Transactions Yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Your transaction history will appear here once you start using your wallet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Code</CardTitle>
                  <CardDescription>Share this code with friends to earn rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 text-center bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold tracking-wider text-primary">{profile?.username || ""}</p>
                  </div>
                  <div className="flex justify-center mt-4 space-x-4">
                    <Button variant="outline" onClick={copyReferralLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button onClick={shareReferralLink}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>Earn rewards by referring friends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex">
                    <div className="flex items-center justify-center w-8 h-8 mr-4 text-white bg-primary rounded-full">
                      1
                    </div>
                    <p>Share your unique referral code with friends</p>
                  </div>
                  <div className="flex">
                    <div className="flex items-center justify-center w-8 h-8 mr-4 text-white bg-primary rounded-full">
                      2
                    </div>
                    <p>When they sign up using your code, they get ₹50 in their wallet</p>
                  </div>
                  <div className="flex">
                    <div className="flex items-center justify-center w-8 h-8 mr-4 text-white bg-primary rounded-full">
                      3
                    </div>
                    <p>You earn ₹100 for each successful referral</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    Rewards are credited once your friend completes their first transaction
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* Referral Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Referral Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 text-center bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Referrals</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="p-4 text-center bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Pending Rewards</p>
                    <p className="text-2xl font-bold">₹0</p>
                  </div>
                  <div className="p-4 text-center bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Earned</p>
                    <p className="text-2xl font-bold">₹200</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Earn rewards by using Temple Address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Complete Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Add all your details to your profile</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium text-primary">₹25</p>
                        <Button size="sm" variant="outline">
                          Claim
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Add Your First Listing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Create your first temple or service listing</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium text-primary">₹50</p>
                        <Button size="sm" variant="outline">
                          Claim
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Verify Your Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Verify your email address</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium text-primary">₹10</p>
                        <Button size="sm" disabled>
                          Claimed
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Daily Login Bonus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Login daily to earn rewards</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium text-primary">₹5</p>
                        <Button size="sm" variant="outline">
                          Claim
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
