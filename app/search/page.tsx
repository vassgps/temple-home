"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, Search, Tag, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"

// API Response Interface
interface SearchResult {
  id: number
  title: string
  listing_type: string
  category: string
  location: string
  image_url: string | null
  status: string
  uuid: string
  slug: string
  created_at: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    count: number
    next: string | null
    previous: string | null
    results: SearchResult[]
  }
  errors: any
  timestamp: string
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [locations, setLocations] = useState<Set<string>>(new Set())
  const [types, setTypes] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [previousUrl, setPreviousUrl] = useState<string | null>(null)
  const [itemsPerPage] = useState(12) // Assuming 12 items per page

  const fetchSearchResults = async (url?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching listings from API...")

      const apiUrl = url || "https://app.templeaddress.com/api/v1/cms/public-listings/"

      const response = await fetch(apiUrl, {
        headers: {
          accept: "application/json",
          "X-CSRFTOKEN": "AXH34jF0GUYC2nkSKfHuqDyzDoxIFu3OszQ7TdtqdCIcBUt0vFdTc25DY7yNCEDp",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      console.log("API response:", data)

      if (!data.success || !data.data || !data.data.results) {
        throw new Error(data.message || "Failed to fetch search results")
      }

      // Update pagination info
      setTotalCount(data.data.count)
      setNextUrl(data.data.next)
      setPreviousUrl(data.data.previous)

      // Extract unique categories, locations, and types for filters
      const categorySet = new Set<string>()
      const locationSet = new Set<string>()
      const typeSet = new Set<string>()

      data.data.results.forEach((result) => {
        if (result.category) categorySet.add(result.category)
        if (result.location) locationSet.add(result.location)
        if (result.listing_type) typeSet.add(result.listing_type)
      })

      setCategories(categorySet)
      setLocations(locationSet)
      setTypes(typeSet)
      setResults(data.data.results)
      setFilteredResults(data.data.results)

      // Set page title and meta description
      document.title = "Search - Temple Address"
      const metaDescription = document.createElement("meta")
      metaDescription.name = "description"
      metaDescription.content = "Search for temples, festivals, and services across India on Temple Address."
      const existingDescription = document.querySelector('meta[name="description"]')
      if (existingDescription) existingDescription.remove()
      document.head.appendChild(metaDescription)
    } catch (error) {
      console.error("Error fetching search results:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setResults([])
      setFilteredResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSearchResults()

    // Cleanup
    return () => {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && metaDesc.getAttribute("content")?.includes("Temple Address")) {
        metaDesc.remove()
      }
    }
  }, [])

  // Apply filters whenever filter values change
  useEffect(() => {
    if (!results) return

    let filtered = [...results]

    // Apply tab filter (listing type)
    if (activeTab !== "all") {
      filtered = filtered.filter((result) => result.listing_type === activeTab)
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((result) => result.category === categoryFilter)
    }

    // Apply location filter
    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter((result) => result.location === locationFilter)
    }

    // Apply type filter
    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((result) => result.listing_type === typeFilter)
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.title.toLowerCase().includes(term) ||
          result.category.toLowerCase().includes(term) ||
          result.location.toLowerCase().includes(term),
      )
    }

    setFilteredResults(filtered)
  }, [results, activeTab, categoryFilter, locationFilter, typeFilter, searchTerm])

  // Format the listing type for display (capitalize)
  const formatListingType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle pagination
  const handleNextPage = () => {
    if (nextUrl) {
      setCurrentPage((prev) => prev + 1)
      fetchSearchResults(nextUrl)
    }
  }

  const handlePreviousPage = () => {
    if (previousUrl) {
      setCurrentPage((prev) => prev - 1)
      fetchSearchResults(previousUrl)
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Banner */}
      <div className="py-16 text-center bg-amber-100">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold">Search Temple Directory</h1>
          <p className="mt-2 text-gray-600">Find temples, festivals, and services across India</p>

          {/* Search Bar */}
          <div className="flex flex-col justify-center max-w-3xl gap-4 mx-auto mt-6 md:flex-row">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by name, category, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 right-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto md:px-6">
        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredResults.length} of {totalCount} results
          </div>
        )}

        {/* Filters Section */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(categories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {Array.from(locations).map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Array.from(types).map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatListingType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("")
                setLocationFilter("")
                setTypeFilter("")
                setActiveTab("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="temples">Temples</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48" />
                <CardHeader className="p-4 pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4" />
                  <div className="flex mt-4 space-x-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
            <h2 className="mt-4 text-2xl font-bold">Error Loading Results</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button className="mt-6" onClick={() => fetchSearchResults()}>
              Try Again
            </Button>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm">
            <Search className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold">No Results Found</h2>
            <p className="mt-2 text-gray-600">
              We couldn't find any listings matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("")
                setLocationFilter("")
                setTypeFilter("")
                setActiveTab("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((result) => (
                <Link
                  key={result.id}
                  href={`/listing/${result.slug}`}
                  className="block transition-transform hover:scale-[1.01]"
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={result.image_url || "/temple-placeholder.png"}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className="absolute right-2 top-2 text-xs"
                        variant={result.status === "VERIFIED" ? "default" : "secondary"}
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg line-clamp-1">{result.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="inline w-4 h-4 mr-1 text-gray-400" />
                        {result.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {result.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {formatListingType(result.listing_type)}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 text-xs text-gray-500 flex justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(result.created_at)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 hover:bg-transparent p-0"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={!previousUrl || isLoading}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!nextUrl || isLoading}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
