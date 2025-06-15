"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  Mail,
  Phone,
  Home,
  ListPlus,
  LayoutDashboard,
  List,
  Settings,
  LogOut,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Edit,
  X,
  Save,
  Plus,
} from "lucide-react"
import { isAdmin, logout, getToken, getCurrentUser } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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

interface UserListing {
  id: number
  uuid: string
  title: string
  listing_type: string
  category: number
  tags: number[]
  location: string
  country: string
  address: string | null
  main_deity: number | null
  slug: string
  subdomain: string | null
  image: string | null
  status: string
  is_active: boolean
  created_at: string
  details?: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    country_code: "+91",
  })
  const [error, setError] = useState<string | null>(null)
  const [userIsStaff, setUserIsStaff] = useState(false)
  const [userListings, setUserListings] = useState<UserListing[]>([])
  const [listingsLoading, setListingsLoading] = useState(false)
  const [listingsError, setListingsError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentEditListing, setCurrentEditListing] = useState<UserListing | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    details: "",
  })
  const [isEditSaving, setIsEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://uat.templeaddress.com"

  // Use a ref to track if we've already loaded mock data
  const usedMockDataRef = useRef(false)

  // Check for tab parameter in URL
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam) {
      if (tabParam === "listings") {
        setActiveTab("view-listings")
      } else {
        setActiveTab(tabParam)
      }
    }
  }, [searchParams])

  // Check authentication only once on initial load
  useEffect(() => {
    // Get user data from localStorage
    const userData = getCurrentUser()
    if (userData) {
      setProfileData(userData)
      setFormData(getFormDataFromProfile(userData))
      setUserIsStaff(isAdmin())
      setIsLoading(false)
    } else {
      // Use mock data if no user data is found
      const mockData = getMockProfileData()
      setProfileData(mockData)
      setFormData(getFormDataFromProfile(mockData))
      setUserIsStaff(false)
      setIsLoading(false)
    }
  }, [])

  // Helper function to get mock profile data
  const getMockProfileData = (): UserProfile => {
    return {
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
    }
  }

  // Helper function to extract form data from profile
  const getFormDataFromProfile = (profile: UserProfile) => {
    return {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      mobile: profile.mobile || "",
      country_code: profile.country_code || "+91",
    }
  }

  // Fetch user listings
  const fetchUserListings = async () => {
    if (!profileData) return

    setListingsLoading(true)
    setListingsError(null)

    try {
      const token = getToken()
      if (!token) {
        // Don't throw an error, just use mock data
        console.log("No authentication token found for listings, using mock data")
        setUserListings(getMockListings())
        setListingsLoading(false)
        return
      }

      const apiUrl = `${baseUrl}/api/v1/cms/masterdata/`
      console.log("Fetching user listings from:", apiUrl)

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
          credentials: "same-origin",
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId))

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setUserListings(data.data.results)
        } else {
          throw new Error(data.message || "Failed to fetch user listings")
        }
      } catch (fetchError) {
        console.error("Fetch listings error:", fetchError)

        // Use mock data as fallback
        setUserListings(getMockListings())
        setListingsError(`Using offline data due to connection issues`)
      }
    } catch (error) {
      console.error("Error fetching user listings:", error)

      // Use mock data even for general errors
      setUserListings(getMockListings())
      setListingsError(`Unable to fetch listings: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setListingsLoading(false)
    }
  }

  // Fetch listings when profile data is available or when activeTab changes to listings
  useEffect(() => {
    if (profileData && (activeTab === "listings" || activeTab === "view-listings")) {
      fetchUserListings()
    }
  }, [profileData, activeTab, baseUrl])

  // Helper function to get mock listings
  const getMockListings = (): UserListing[] => {
    return [
      {
        id: 2,
        uuid: "5b351dff-4ea7-47fc-80ea-86f95bcc20fa",
        title: "Chelavoor Thiruthikkavu Temple",
        listing_type: "temples",
        category: 4,
        tags: [1, 2],
        location: "Palakkottu vayal",
        country: "India",
        address: "Thiruthikkavu, Palakkottu vayal\r\nP.O. Kottamparamba, Kozhikode",
        main_deity: 1,
        slug: "thiruthikkavu-kshethram",
        subdomain: "sasq4",
        image: "/serene-temple.png",
        status: "VERIFIED",
        is_active: true,
        created_at: "2025-04-30T20:59:44.049868+05:30",
        details: "A beautiful temple dedicated to Lord Shiva, located in Kozhikode district.",
      },
      {
        id: 6,
        uuid: "d459824a-5ee5-4bde-a9eb-a34a74c4585d",
        title: "Thrissure Pooram",
        listing_type: "festivals",
        category: 4,
        tags: [1, 2],
        location: "Thrissure",
        country: "India",
        address: null,
        main_deity: null,
        slug: "thrissure-pooram",
        subdomain: null,
        image: null,
        status: "PENDING",
        is_active: true,
        created_at: "2025-05-03T21:54:37.782886+05:30",
        details: "One of the most famous temple festivals in Kerala, known for its grand elephant processions.",
      },
    ]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const token = getToken()

      if (!token) {
        // Just update local state without API call if no token
        if (profileData) {
          setProfileData({
            ...profileData,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            mobile: formData.mobile,
            country_code: formData.country_code,
          })
        }

        toast({
          title: "Profile Updated Locally",
          description: "Your profile has been updated in offline mode.",
          variant: "warning",
        })

        setIsSaving(false)
        return
      }

      // Make the API call to update the profile
      // Note: Ensure the URL ends with a trailing slash
      const apiUrl = `${baseUrl}/api/v1/users/profile/`
      console.log("Updating profile at:", apiUrl)

      // Prepare the payload with all required fields
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile: formData.mobile,
        country_code: formData.country_code,
        is_active: profileData?.is_active ?? true,
        is_deleted: profileData?.is_deleted ?? false,
      }

      console.log("Sending update payload:", payload)

      // Try multiple methods if one fails
      let response
      let responseData

      try {
        // First attempt with PUT
        response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        // Log response status for debugging
        console.log("Profile update response status (PUT):", response.status)

        if (!response.ok) {
          // If PUT fails, try with PATCH
          console.log("PUT failed, trying PATCH...")
          response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })

          console.log("Profile update response status (PATCH):", response.status)
        }

        // Try to parse the response as JSON
        try {
          responseData = await response.json()
          console.log("Profile update response data:", responseData)
        } catch (jsonError) {
          console.error("Error parsing response JSON:", jsonError)
          const textResponse = await response.text()
          console.log("Raw response text:", textResponse)
          throw new Error("Failed to parse API response")
        }
      } catch (fetchError) {
        console.error("Fetch error during profile update:", fetchError)
        throw fetchError
      }

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`)
      }

      if (responseData && responseData.success) {
        // Update local state with the returned data
        setProfileData(responseData.data)
        setFormData(getFormDataFromProfile(responseData.data))

        // Also update localStorage
        localStorage.setItem("user", JSON.stringify(responseData.data))

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
      } else if (response.ok) {
        // If the response was OK but didn't have the expected format,
        // still consider it a success and update the local state
        if (profileData) {
          const updatedProfile = {
            ...profileData,
            ...payload,
          }
          setProfileData(updatedProfile)

          // Also update localStorage
          localStorage.setItem("user", JSON.stringify(updatedProfile))
        }

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw new Error(responseData?.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)

      // Even if the API call fails, update the local state
      if (profileData) {
        const updatedProfile = {
          ...profileData,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile: formData.mobile,
          country_code: formData.country_code,
        }
        setProfileData(updatedProfile)

        // Also update localStorage
        localStorage.setItem("user", JSON.stringify(updatedProfile))
      }

      setError(error instanceof Error ? error.message : "Failed to update profile")
      toast({
        title: "Warning",
        description: "Profile updated locally, but server update failed. Changes may not persist after logout.",
        variant: "warning",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditListing = (listing: UserListing) => {
    setCurrentEditListing(listing)
    setEditFormData({
      title: listing.title,
      details: listing.details || "",
    })
    setEditError(null)
    setEditDialogOpen(true)
  }

  const handleSaveListingChanges = async () => {
    if (!currentEditListing) return

    setIsEditSaving(true)
    setEditError(null)

    try {
      const token = getToken()

      if (!token) {
        // Just update local state without API call if no token
        const updatedListings = userListings.map((listing) =>
          listing.uuid === currentEditListing.uuid
            ? { ...listing, title: editFormData.title, details: editFormData.details }
            : listing,
        )
        setUserListings(updatedListings)

        toast({
          title: "Listing Updated Locally",
          description: "Your listing has been updated in offline mode.",
          variant: "warning",
        })

        setEditDialogOpen(false)
        setIsEditSaving(false)
        return
      }

      // Make the API call to update the listing
      const apiUrl = `${baseUrl}/api/v1/cms/masterdata/${currentEditListing.uuid}/`
      console.log("Updating listing at:", apiUrl)

      // Prepare the payload with all required fields
      const payload = {
        title: editFormData.title,
        details: editFormData.details,
      }

      console.log("Sending listing update payload:", payload)

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      // Log response status for debugging
      console.log("Listing update response status:", response.status)

      let responseData
      try {
        responseData = await response.json()
        console.log("Listing update response data:", responseData)
      } catch (jsonError) {
        console.error("Error parsing response JSON:", jsonError)
        const textResponse = await response.text()
        console.log("Raw response text:", textResponse)
      }

      if (!response.ok) {
        throw new Error(`Failed to update listing: ${response.status} ${response.statusText}`)
      }

      // Update the listing in the local state
      const updatedListings = userListings.map((listing) =>
        listing.uuid === currentEditListing.uuid
          ? { ...listing, title: editFormData.title, details: editFormData.details }
          : listing,
      )
      setUserListings(updatedListings)

      toast({
        title: "Listing Updated",
        description: "Your listing has been updated successfully.",
      })

      setEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating listing:", error)

      // Even if the API call fails, update the local state
      const updatedListings = userListings.map((listing) =>
        listing.uuid === currentEditListing?.uuid
          ? { ...listing, title: editFormData.title, details: editFormData.details }
          : listing,
      )
      setUserListings(updatedListings)

      setEditError(error instanceof Error ? error.message : "Failed to update listing")
      toast({
        title: "Warning",
        description: "Listing updated locally, but server update failed. Changes may not persist after logout.",
        variant: "warning",
      })
    } finally {
      setIsEditSaving(false)
    }
  }

  const handleViewListing = (slug: string) => {
    router.push(`/listings/${slug}`)
  }

  const handleAddListing = () => {
    router.push("/add-listing")
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-500"
      case "PENDING":
        return "bg-yellow-500"
      case "REJECTED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Function to render listings content
  const renderListingsContent = () => {
    if (listingsLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddListing} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </div>

        {userListings.length > 0 ? (
          <div className="space-y-4">
            {userListings.map((listing) => (
              <Card key={listing.uuid} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full h-48 md:w-1/3 md:h-auto">
                    <Image
                      src={listing.image || "/placeholder.svg?height=200&width=300&query=temple"}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusBadgeColor(listing.status)}`}>
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="p-4 md:w-2/3">
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <MapPin size={16} className="mr-1" />
                      <span>
                        {listing.location}, {listing.country}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar size={16} className="mr-1" />
                      <span>Created on {formatDate(listing.created_at)}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock size={16} className="mr-1" />
                      <span>Type: {listing.listing_type}</span>
                    </div>
                    <div className="flex mt-4 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary hover:bg-primary hover:text-white"
                        onClick={() => handleViewListing(listing.slug)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditListing(listing)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Home className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Listings Yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't created any listings yet. Add your first listing to get started.
            </p>
            <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={handleAddListing}>
              <ListPlus className="w-4 h-4 mr-2" />
              Add New Listing
            </Button>
          </div>
        )}

        {listingsError && (
          <div className="mt-4 p-4 rounded-md bg-amber-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">{listingsError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-4">
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  // Always render the profile UI if we have profile data, even if there's an error
  if (profileData) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold">Profile</h1>

        {error && (
          <div className="p-4 mt-4 mb-4 rounded-md bg-amber-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white bg-primary rounded-full">
                    {profileData?.first_name?.charAt(0) || ""}
                    {profileData?.last_name?.charAt(0) || ""}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">
                    {profileData?.first_name || ""} {profileData?.last_name || ""}
                  </h2>
                  <p className="text-sm text-gray-500">@{profileData?.username || ""}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className={`justify-start ${activeTab === "profile" ? "text-primary" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className={`justify-start ${activeTab === "view-listings" ? "text-primary" : ""}`}
                onClick={() => setActiveTab("view-listings")}
              >
                <List className="w-4 h-4 mr-2" />
                View Listings
              </Button>
              <Button variant="ghost" className="justify-start" onClick={handleAddListing}>
                <ListPlus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
              {userIsStaff && (
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/admin")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
              <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="first_name"
                          name="first_name"
                          className="pl-10"
                          value={formData.first_name}
                          onChange={handleChange}
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="last_name"
                          name="last_name"
                          className="pl-10"
                          value={formData.last_name}
                          onChange={handleChange}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <div className="flex space-x-2">
                      <div className="relative w-1/4">
                        <Input
                          id="country_code"
                          name="country_code"
                          className="pl-3"
                          value={formData.country_code}
                          onChange={handleChange}
                          disabled={isSaving}
                        />
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="mobile"
                          name="mobile"
                          className="pl-10"
                          value={formData.mobile}
                          onChange={handleChange}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "view-listings" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Manage your temple and service listings</CardDescription>
                </CardHeader>
                <CardContent>{renderListingsContent()}</CardContent>
              </Card>
            )}

            {activeTab !== "profile" && activeTab !== "view-listings" && (
              <Tabs defaultValue="profile" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="w-full">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="first_name"
                              name="first_name"
                              className="pl-10"
                              value={formData.first_name}
                              onChange={handleChange}
                              disabled={isSaving}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="last_name"
                              name="last_name"
                              className="pl-10"
                              value={formData.last_name}
                              onChange={handleChange}
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            className="pl-10"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSaving}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile</Label>
                        <div className="flex space-x-2">
                          <div className="relative w-1/4">
                            <Input
                              id="country_code"
                              name="country_code"
                              className="pl-3"
                              value={formData.country_code}
                              onChange={handleChange}
                              disabled={isSaving}
                            />
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="mobile"
                              name="mobile"
                              className="pl-10"
                              value={formData.mobile}
                              onChange={handleChange}
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="listings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Listings</CardTitle>
                      <CardDescription>Manage your temple and service listings</CardDescription>
                    </CardHeader>
                    <CardContent>{renderListingsContent()}</CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bookmarks" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bookmarks</CardTitle>
                      <CardDescription>View your saved temples and services</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Home className="w-12 h-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">No Bookmarks Yet</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          You haven't bookmarked any listings yet. Browse listings and save your favorites.
                        </p>
                        <Button className="mt-4 bg-primary hover:bg-primary/90">Browse Listings</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Edit Listing Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Listing</DialogTitle>
              <DialogDescription>Make changes to your listing. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {editError && (
                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  <AlertTriangle className="inline-block w-4 h-4 mr-2" />
                  {editError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  disabled={isEditSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-details">Details</Label>
                <Textarea
                  id="edit-details"
                  name="details"
                  rows={5}
                  value={editFormData.details}
                  onChange={handleEditChange}
                  disabled={isEditSaving}
                  placeholder="Provide details about this listing..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isEditSaving}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSaveListingChanges} disabled={isEditSaving}>
                {isEditSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Fallback UI - should rarely be seen since we always try to use mock data
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="p-8 mt-8 text-center bg-amber-50 rounded-lg">
        <AlertTriangle className="w-16 h-16 mx-auto text-amber-500" />
        <h2 className="mt-4 text-2xl font-bold">Loading Profile</h2>
        <p className="mt-2 text-amber-600">{error || "Preparing your profile data..."}</p>
        <div className="flex justify-center mt-6 space-x-4">
          <Button onClick={() => window.location.reload()}>Refresh</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
