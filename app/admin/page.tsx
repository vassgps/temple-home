"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { isAuthenticated, isAdmin, getCurrentUser } from "@/lib/auth"
import { AlertTriangle, Settings, Users, FileText, ListPlus } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated and has admin privileges
    if (!isAuthenticated()) {
      router.push("/auth/login")
      return
    }

    if (!isAdmin()) {
      router.push("/")
      return
    }

    setUser(getCurrentUser())
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.username || "Admin"}</p>
        </div>
        <div>
          <Button variant="outline" onClick={() => router.push("/")}>
            View Site
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-gray-500">+5 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-gray-500">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 text-gray-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,500</div>
            <p className="text-xs text-gray-500">+₹2,100 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your temple directory</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button className="justify-start" variant="outline">
              <ListPlus className="w-4 h-4 mr-2" />
              Add New Listing
            </Button>
            <Button className="justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button className="justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Review Listings
            </Button>
            <Button className="justify-start" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Site Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">New listing added: Guruvayur Temple</p>
                  <p className="text-xs text-gray-500">2 hours ago by admin</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">User registered: ramu.pk@gmail.com</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 mr-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Listing update request: Sabarimala Temple</p>
                  <p className="text-xs text-gray-500">Yesterday by user123</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 mr-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Listing reported: Invalid information</p>
                  <p className="text-xs text-gray-500">2 days ago by user456</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
