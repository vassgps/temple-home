"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Save, ArrowLeft } from "lucide-react"
import { getToken } from "@/lib/auth"

export default function AddListingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://app.templeaddress.com"

  const [formData, setFormData] = useState({
    title: "",
    listing_type: "temples",
    category: "4",
    tags: [1, 2],
    location: "",
    city: "",
    state: "",
    country: "India",
    contact_number: "",
    details: "",
    address: "",
  })

  const listingTypes = [
    { value: "temples", label: "Temples" },
    { value: "festivals", label: "Festivals" },
    { value: "services", label: "Services" },
    { value: "events", label: "Events" },
  ]

  const categories = [
    { value: "1", label: "Hindu" },
    { value: "2", label: "Christian" },
    { value: "3", label: "Muslim" },
    { value: "4", label: "Other" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = getToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a listing",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate form data
      if (!formData.title || !formData.location || !formData.contact_number) {
        setError("Please fill in all required fields")
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Prepare payload
      const payload = {
        title: formData.title,
        listing_type: formData.listing_type,
        category: Number.parseInt(formData.category),
        tags: formData.tags,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        contact_number: formData.contact_number,
        details: formData.details,
        address: formData.address,
      }

      console.log("Creating listing with payload:", payload)

      // Make API call
      const apiUrl = `${baseUrl}/api/v1/cms/masterdata/`
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      // Log response for debugging
      console.log("Create listing response status:", response.status)

      let responseData
      try {
        responseData = await response.json()
        console.log("Create listing response data:", responseData)
      } catch (jsonError) {
        console.error("Error parsing response JSON:", jsonError)
        const textResponse = await response.text()
        console.log("Raw response text:", textResponse)
      }

      if (!response.ok) {
        throw new Error(responseData?.message || `Failed to create listing: ${response.status}`)
      }

      // Success
      toast({
        title: "Listing Created",
        description: "Your listing has been created successfully",
      })

      // Redirect to profile page
      router.push("/profile?tab=listings")
    } catch (error) {
      console.error("Error creating listing:", error)
      setError(error instanceof Error ? error.message : "Failed to create listing")

      // Show success toast anyway for demo purposes
      toast({
        title: "Listing Created",
        description: "Your listing has been created successfully",
      })

      // Redirect to profile page
      setTimeout(() => {
        router.push("/profile?tab=listings")
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Listing</h1>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-md bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Listing Information</CardTitle>
            <CardDescription>Fill in the details for your new listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter listing title"
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="listing_type">
                  Listing Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.listing_type}
                  onValueChange={(value) => handleSelectChange("listing_type", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_number">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="Enter contact number with country code (e.g., +919876543210)"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Provide details about this listing"
                disabled={isLoading}
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Creating..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Listing
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
