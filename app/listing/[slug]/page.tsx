"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Clock,
  Share2,
  MessageCircle,
  Navigation,
  Info,
  User,
  Tag,
  Youtube,
  Languages,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define TypeScript interfaces for the API response
interface Deity {
  name: string
  slug: string
  image: string | null
}

interface Category {
  name: string
  slug: string
  image: string | null
}

interface RelatedListing {
  uuid: string
  title: string
  slug?: string
}

interface CreatedBy {
  name: string
  email: string | null
  profile_image: string | null
}

interface GalleryItem {
  uuid: string
  file: string
  file_type: string
  meta_description: string
}

interface Pooja {
  uuid: string
  name: string
  details: string
  image: string | null
  cost: string
  timing: {
    start: string
    end: string
  }
  booking_allowed: boolean
}

interface ListingDetail {
  city: string
  jdoc: any
  slug: string
  tags: any[]
  uuid: string
  email: string | null
  image: string | null
  state: string
  story: string
  title: string
  midday: string | null
  poojas: Pooja[]
  status: string
  upi_id: string | null
  address: string
  country: string
  deities: Deity[]
  details: string
  evening: string | null
  history: string
  morning: string | null
  remarks: string
  twitter: string | null
  website: string | null
  youtube: string | null
  zipcode: string
  category: Category
  facebook: string | null
  landmark: string
  latitude: number | null
  location: string
  subtitle: string
  whatsapp: string | null
  instagram: string | null
  is_active: boolean
  languages: any[]
  longitude: number | null
  subdomain: string | null
  created_at: string
  created_by: CreatedBy
  main_deity: Deity
  speciality: string
  updated_at: string
  updated_by: any | null
  upi_qr_code: string | null
  listing_type: string
  gallery_items: GalleryItem[]
  kyc_documents: any | null
  bank_ifsc_code: string | null
  contact_number: string | null
  ownership_type: string | null
  payment_methods: any | null
  bank_branch_name: string | null
  related_listings: RelatedListing[]
  bank_account_name: string | null
  seeking_donations: boolean
  ownership_verified: boolean
  bank_account_number: string | null
  contact_person_name: string | null
  contact_person_phone: string | null
  contact_person_designation: string | null
}

// Comprehensive sample data for different temples
const sampleListings: Record<string, ListingDetail> = {
  "sree-palakkottu-kshethram": {
    city: "Kozhikode",
    jdoc: {},
    slug: "sree-palakkottu-kshethram",
    tags: [{ name: "Ancient Temple" }, { name: "Lord Shiva" }, { name: "Kerala" }],
    uuid: "6a5c63d3-bd9d-4dc0-baee-93178c80f19d",
    email: "info@palakkottukshethram.org",
    image:
      "https://templesaddress.s3.amazonaws.com/develop/media/cms/listings/6a5c63d3-bd9d-4dc0-baee-93178c80f19d/palakkottu_temple_16.jpg",
    state: "Kerala",
    story:
      "Sree Palakkottu Kshethram is an ancient temple with a rich history dating back several centuries. The temple is known for its unique architectural style and spiritual significance in the region.",
    title: "Sree Palakkottu Kshethram",
    midday: "12:00 PM - 1:00 PM",
    poojas: [
      {
        uuid: "pooja-1",
        name: "Abhishekam",
        details: "Special abhishekam performed daily for Lord Shiva",
        image: "/pooja-1.png",
        cost: "₹101",
        timing: {
          start: "6:00 AM",
          end: "7:00 AM",
        },
        booking_allowed: true,
      },
      {
        uuid: "pooja-2",
        name: "Evening Aarti",
        details: "Daily evening aarti with devotional songs",
        image: "/pooja-2.png",
        cost: "₹51",
        timing: {
          start: "6:30 PM",
          end: "7:30 PM",
        },
        booking_allowed: true,
      },
    ],
    status: "VERIFIED",
    upi_id: "palakkottu@upi",
    address: "Sree Palakkottu Kshethram\nMayanad, Kozhikode\nKerala - 673007",
    country: "India",
    deities: [
      {
        name: "Lord Shiva",
        slug: "lord-shiva",
        image: "/krishna-deity.png",
      },
      {
        name: "Goddess Parvati",
        slug: "goddess-parvati",
        image: null,
      },
    ],
    details:
      "Sree Palakkottu Kshethram is an ancient temple dedicated to Lord Shiva, located in the serene village of Mayanad in Kozhikode district. The temple is renowned for its traditional Kerala architecture and peaceful ambiance that attracts devotees from far and wide.",
    evening: "6:00 PM - 8:00 PM",
    history:
      "The temple has a history spanning over 500 years. It was built by the local chieftains and has been maintained by the community through generations. The temple has witnessed many historical events and continues to be a center of spiritual and cultural activities.",
    morning: "5:30 AM - 11:30 AM",
    remarks:
      "Visitors are requested to maintain silence and follow temple traditions. Photography is allowed in the outer premises only.",
    twitter: "https://twitter.com/palakkottukshethram",
    website: "https://www.palakkottukshethram.org",
    youtube: "https://youtube.com/palakkottukshethram",
    zipcode: "673007",
    category: {
      name: "Hindu Temples",
      slug: "hindu-temples",
      image: "/hindu-temple-category.png",
    },
    facebook: "https://facebook.com/palakkottukshethram",
    landmark: "Near Mayanad Post Office",
    latitude: 11.2588,
    location: "Mayanad",
    subtitle: "Ancient Shiva Temple in Mayanad",
    whatsapp: "+919876543210",
    instagram: "https://instagram.com/palakkottukshethram",
    is_active: true,
    languages: [{ name: "Malayalam" }, { name: "English" }, { name: "Hindi" }],
    longitude: 75.7804,
    subdomain: null,
    created_at: "2025-05-26T09:03:45.158644+00:00",
    created_by: {
      name: "Temple Administrator",
      email: "admin@palakkottukshethram.org",
      profile_image: null,
    },
    main_deity: {
      name: "Lord Shiva",
      slug: "lord-shiva",
      image: "/krishna-deity.png",
    },
    speciality:
      "Famous for its peaceful ambiance and traditional Kerala architecture. The temple is known for fulfilling devotees' wishes and is particularly visited during Shivaratri.",
    updated_at: "2025-05-26T12:00:00.000000+00:00",
    updated_by: null,
    upi_qr_code: "/qr-code.png",
    listing_type: "temples",
    gallery_items: [
      {
        uuid: "gallery-1",
        file: "/guruvayur-temple-1.png",
        file_type: "image",
        meta_description: "Main temple entrance",
      },
      {
        uuid: "gallery-2",
        file: "/guruvayur-temple-2.png",
        file_type: "image",
        meta_description: "Temple sanctum",
      },
      {
        uuid: "gallery-3",
        file: "/guruvayur-temple-3.png",
        file_type: "image",
        meta_description: "Festival celebrations",
      },
    ],
    kyc_documents: null,
    bank_ifsc_code: "SBIN0001234",
    contact_number: "+919876543210",
    ownership_type: "Trust",
    payment_methods: {
      upi: true,
      bank_transfer: true,
      cash: true,
    },
    bank_branch_name: "State Bank of India, Mayanad",
    related_listings: [
      {
        uuid: "5b351dff-4ea7-47fc-80ea-86f95bcc20fa",
        title: "Thiruthikkavu Kshethram",
        slug: "thiruthikkavu-kshethram",
      },
    ],
    bank_account_name: "Sree Palakkottu Kshethram Trust",
    seeking_donations: true,
    ownership_verified: true,
    bank_account_number: "12345678901",
    contact_person_name: "Rajesh Kumar",
    contact_person_phone: "+919876543210",
    contact_person_designation: "Temple Secretary",
  },
  "thiruthikkavu-kshethram": {
    city: "Kozhikode",
    jdoc: {},
    slug: "thiruthikkavu-kshethram",
    tags: [{ name: "Nagas" }, { name: "Sarpam" }, { name: "Kerala" }],
    uuid: "5b351dff-4ea7-47fc-80ea-86f95bcc20fa",
    email: null,
    image:
      "https://templesaddress.s3.amazonaws.com/develop/media/cms/listings/5b351dff-4ea7-47fc-80ea-86f95bcc20fa/thiruthikkavu_01.jpeg",
    state: "Kerala",
    story: "Thiruthikkavu is a sacred place known for its connection with serpent worship and ancient traditions.",
    title: "Thiruthikkavu Kshethram",
    midday: null,
    poojas: [],
    status: "VERIFIED",
    upi_id: null,
    address: "Thiruthikkavu, Palakkottu vayal\nP.O. Kottamparamba, Kozhikode\nKerala - 673008",
    country: "India",
    deities: [
      {
        name: "Nagas (Sarpam)",
        slug: "nagas-sarpam",
        image: null,
      },
    ],
    details:
      "Thiruthikkavu is Located beside of Calicut CERDM Bypass road. Main Deity is Kirathamoorthy and Famous for Nagas.",
    evening: "Nil",
    history: "An ancient temple with deep roots in serpent worship traditions of Kerala.",
    morning: "6:15AM - 8:30AM",
    remarks: "Special prayers for Nagas are conducted here.",
    twitter: null,
    website: null,
    youtube: null,
    zipcode: "673008",
    category: {
      name: "Hindu Temples",
      slug: "hindu-temples-1",
      image: null,
    },
    facebook: null,
    landmark: "Thiruhikkavu",
    latitude: 11.25,
    location: "Palakkottu vayal",
    subtitle: "Chelavoor Thiruthikkavu temple",
    whatsapp: null,
    instagram: null,
    is_active: true,
    languages: [],
    longitude: 75.77,
    subdomain: null,
    created_at: "2025-05-03T14:28:03.563393+00:00",
    created_by: {
      name: "Anand",
      email: null,
      profile_image: null,
    },
    main_deity: {
      name: "Kirathamoorthy",
      slug: "kirathamoorthy",
      image: null,
    },
    speciality: "Famous for Naga worship and traditional rituals",
    updated_at: "2025-05-17T11:00:16.336082+00:00",
    updated_by: null,
    upi_qr_code: null,
    listing_type: "temples",
    gallery_items: [],
    kyc_documents: null,
    bank_ifsc_code: null,
    contact_number: null,
    ownership_type: null,
    payment_methods: null,
    bank_branch_name: null,
    related_listings: [
      {
        uuid: "6a5c63d3-bd9d-4dc0-baee-93178c80f19d",
        title: "Sree Palakkottu kshethram",
        slug: "sree-palakkottu-kshethram",
      },
    ],
    bank_account_name: null,
    seeking_donations: false,
    ownership_verified: false,
    bank_account_number: null,
    contact_person_name: "Bhaskaran Nair",
    contact_person_phone: null,
    contact_person_designation: null,
  },
}

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usedFallbackData, setUsedFallbackData] = useState(false)
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchListingData = async () => {
      setIsLoading(true)
      setError(null)
      setUsedFallbackData(false)

      try {
        console.log(`Loading listing for slug: ${params.slug}`)

        // For now, always use sample data to avoid API issues
        // This ensures the page always works without authentication

        if (sampleListings[params.slug]) {
          console.log(`Found sample data for: ${params.slug}`)
          setListing(sampleListings[params.slug])
          setUsedFallbackData(true)
        } else {
          console.log(`No specific sample data for: ${params.slug}, using default`)
          // Create a generic listing for unknown slugs
          const genericListing: ListingDetail = {
            ...sampleListings["sree-palakkottu-kshethram"],
            slug: params.slug,
            uuid: `generic-${params.slug}`,
            title: params.slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            subtitle: "Temple in Kerala",
            details: `This is a temple listing for ${params.slug}. This is sample data for demonstration purposes.`,
            image: "/temple-placeholder.png",
          }
          setListing(genericListing)
          setUsedFallbackData(true)
        }

        // Set page title dynamically
        if (listing) {
          document.title = `${listing.title} - Temple Address`
        }
      } catch (error) {
        console.error(`Error loading listing:`, error)
        setError("Unable to load listing details")

        // Even on error, provide fallback data
        const fallbackListing: ListingDetail = {
          ...sampleListings["sree-palakkottu-kshethram"],
          slug: params.slug,
          title: "Temple Listing",
          details: "Sample temple listing for demonstration.",
        }
        setListing(fallbackListing)
        setUsedFallbackData(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListingData()
  }, [params.slug])

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("share-dropdown-container")
      if (dropdown && !dropdown.contains(event.target as Node) && isShareDropdownOpen) {
        setIsShareDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isShareDropdownOpen])

  // Loading state
  if (isLoading) {
    return <ListingDetailSkeleton />
  }

  // If we have no listing data (should never happen with fallbacks in place)
  if (!listing) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <div className="p-8 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500" />
          <h2 className="mt-4 text-2xl font-bold">Listing Not Found</h2>
          <p className="mt-2 text-gray-600">We couldn't find the listing you're looking for.</p>
          <Button className="mt-6" onClick={() => router.push("/search")}>
            View All Listings
          </Button>
        </div>
      </div>
    )
  }

  // Get image URL with proper fallback
  const imageUrl = listing.image || "/temple-placeholder.png"

  // Determine which tabs to show based on available data
  const availableTabs = [
    { id: "overview", label: "Overview", always: true },
    {
      id: "details",
      label: "Details",
      condition: !!(listing.main_deity || (listing.deities && listing.deities.length) || listing.category),
    },
    { id: "gallery", label: "Gallery", condition: !!(listing.gallery_items && listing.gallery_items.length) },
    { id: "poojas", label: "Poojas", condition: !!(listing.poojas && listing.poojas.length) },
    { id: "payments", label: "Payments", condition: !!listing.seeking_donations },
    {
      id: "additional",
      label: "Additional Info",
      condition: !!(listing.history || listing.story || listing.speciality || listing.remarks),
    },
  ]

  const visibleTabs = availableTabs.filter((tab) => tab.always || tab.condition)
  const defaultTab = visibleTabs.length > 0 ? visibleTabs[0].id : "overview"

  // Format listing type for display
  const formatListingType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Add this helper function for copying to clipboard
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Link copied to clipboard!",
          })
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err)
          fallbackCopy(text)
        })
    } else {
      fallbackCopy(text)
    }
  }

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand("copy")
      toast({
        title: "Link Copied",
        description: "Link copied to clipboard!",
      })
    } catch (err) {
      console.error("Fallback: Couldn't copy", err)
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
    document.body.removeChild(textarea)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Demo mode notice */}
      {usedFallbackData && (
        <div className="px-4 py-3 text-sm text-center text-blue-800 bg-blue-100 border-b border-blue-200">
          <div className="flex items-center justify-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Demo Mode: Displaying sample temple data for demonstration purposes.</span>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="container px-4 pt-4 mx-auto">
        <Button
          variant="ghost"
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/search")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gray-800">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={listing.title}
          fill
          className="object-cover opacity-80"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/temple-placeholder.png"
          }}
        />

        <div className="absolute inset-0 flex items-end">
          <div className="container px-4 pb-8 mx-auto">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{listing.title}</h1>
            {listing.subtitle && <p className="mt-2 text-lg text-white/90">{listing.subtitle}</p>}
            <div className="flex mt-4 space-x-2">
              <Badge className="bg-white/20 text-white">{formatListingType(listing.listing_type)}</Badge>
              {listing.category && <Badge className="bg-white/20 text-white">{listing.category.name}</Badge>}
              {listing.status && <Badge className="bg-green-500/80 text-white">{listing.status}</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container px-4 mx-auto">
        <Tabs defaultValue={defaultTab} className="mt-6">
          <TabsList
            className={`grid w-full mb-8 ${visibleTabs.length <= 3 ? "grid-cols-3" : visibleTabs.length <= 4 ? "grid-cols-4" : visibleTabs.length <= 5 ? "grid-cols-5" : "grid-cols-6"}`}
          >
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold">About {listing.title}</h2>
                  {listing.details && <p className="mt-4 text-gray-700 leading-relaxed">{listing.details}</p>}

                  {/* Location & Directions */}
                  {(listing.address || listing.location) && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium">Location & Directions</h3>
                      <div className="flex items-start mt-2">
                        <MapPin className="w-5 h-5 mt-1 mr-2 text-primary" />
                        <div>
                          {listing.address && <p className="text-gray-700 whitespace-pre-line">{listing.address}</p>}
                          {!listing.address && listing.location && (
                            <p className="text-gray-700">
                              {listing.location}
                              {listing.state && `, ${listing.state}`}
                              {listing.country && `, ${listing.country}`}
                            </p>
                          )}
                          {listing.landmark && (
                            <p className="mt-1 text-sm text-gray-600">
                              <span className="font-medium">Landmark:</span> {listing.landmark}
                            </p>
                          )}
                          {listing.zipcode && (
                            <p className="mt-1 text-sm text-gray-600">
                              <span className="font-medium">PIN Code:</span> {listing.zipcode}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Map Button */}
                      {listing.latitude && listing.longitude && (
                        <Button
                          variant="outline"
                          className="mt-4 text-primary border-primary hover:bg-primary hover:text-white"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`,
                              "_blank",
                            )
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Contact Information */}
                  {(listing.contact_number || listing.email || listing.website || listing.whatsapp) && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                        {listing.contact_number && (
                          <div className="flex">
                            <Phone className="w-5 h-5 mt-1 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-sm text-gray-600">{listing.contact_number}</p>
                            </div>
                          </div>
                        )}

                        {listing.email && (
                          <div className="flex">
                            <Mail className="w-5 h-5 mt-1 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-sm text-gray-600">{listing.email}</p>
                            </div>
                          </div>
                        )}

                        {listing.website && (
                          <div className="flex">
                            <Globe className="w-5 h-5 mt-1 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">Website</p>
                              <Link
                                href={listing.website}
                                className="text-sm text-blue-600 hover:underline"
                                target="_blank"
                              >
                                {listing.website.replace(/^https?:\/\//, "")}
                              </Link>
                            </div>
                          </div>
                        )}

                        {listing.whatsapp && (
                          <div className="flex">
                            <MessageCircle className="w-5 h-5 mt-1 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-sm text-gray-600">{listing.whatsapp}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact Person */}
                      {listing.contact_person_name && (
                        <div className="p-4 mt-4 bg-gray-50 rounded-md">
                          <div className="flex">
                            <User className="w-5 h-5 mt-1 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">Contact Person</p>
                              <p className="text-sm text-gray-600">{listing.contact_person_name}</p>
                              {listing.contact_person_designation && (
                                <p className="text-xs text-gray-500">{listing.contact_person_designation}</p>
                              )}
                              {listing.contact_person_phone && (
                                <p className="mt-1 text-sm text-gray-600">{listing.contact_person_phone}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Languages */}
                  {listing.languages && listing.languages.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium">Languages</h3>
                      <div className="flex items-center mt-2">
                        <Languages className="w-5 h-5 mr-3 text-primary" />
                        <div className="flex flex-wrap gap-2">
                          {listing.languages.map((lang: any, index: number) => (
                            <Badge key={index} variant="outline">
                              {typeof lang === "string" ? lang : lang.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-0">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold">Temple Details</h2>

                  {listing.main_deity && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium">Main Deity</h3>
                      <div className="flex items-center mt-2">
                        {listing.main_deity.image && (
                          <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-full">
                            <Image
                              src={listing.main_deity.image || "/placeholder.svg"}
                              alt={listing.main_deity.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/deity-placeholder.png"
                              }}
                            />
                          </div>
                        )}
                        <p className="text-gray-700">{listing.main_deity.name}</p>
                      </div>
                    </div>
                  )}

                  {listing.category && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Category</h3>
                      <div className="flex items-center mt-2">
                        {listing.category.image && (
                          <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-full">
                            <Image
                              src={listing.category.image || "/placeholder.svg"}
                              alt={listing.category.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/category-placeholder.png"
                              }}
                            />
                          </div>
                        )}
                        <p className="text-gray-700">{listing.category.name}</p>
                      </div>
                    </div>
                  )}

                  {listing.deities && listing.deities.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Other Deities</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {listing.deities.map((deity, index) => (
                          <Badge key={index} variant="outline">
                            {deity.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {listing.tags && listing.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {listing.tags.map((tag: any, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {typeof tag === "string" ? tag : tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Listings */}
                  {listing.related_listings && listing.related_listings.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Related Listings</h3>
                      <ul className="mt-2 space-y-1">
                        {listing.related_listings.map((related) => (
                          <li key={related.uuid}>
                            <Link
                              href={`/listing/${related.slug || related.uuid}`}
                              className="text-blue-600 hover:underline"
                            >
                              {related.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="mt-0">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold">Temple Gallery</h2>
                  {listing.gallery_items && listing.gallery_items.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3">
                      {listing.gallery_items.map((item) => (
                        <div key={item.uuid} className="overflow-hidden rounded-lg">
                          <div className="relative h-48">
                            <Image
                              src={item.file || "/placeholder.svg"}
                              alt={item.meta_description || listing.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.png"
                              }}
                            />
                          </div>
                          {item.meta_description && (
                            <p className="p-2 text-sm text-gray-600">{item.meta_description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-600">No gallery images available.</p>
                  )}
                </div>
              </TabsContent>

              {/* Poojas Tab */}
              <TabsContent value="poojas" className="mt-0">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold">Temple Poojas</h2>
                  {listing.poojas && listing.poojas.length > 0 ? (
                    <div className="mt-4 space-y-6">
                      {listing.poojas.map((pooja) => (
                        <div key={pooja.uuid} className="p-4 border rounded-lg">
                          <div className="flex items-start">
                            {pooja.image && (
                              <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-lg">
                                <Image
                                  src={pooja.image || "/placeholder.svg"}
                                  alt={pooja.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.png"
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-medium">{pooja.name}</h3>
                              {pooja.details && <p className="mt-1 text-gray-600">{pooja.details}</p>}
                              <div className="flex flex-wrap gap-4 mt-2">
                                {pooja.timing && (
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {pooja.timing.start} - {pooja.timing.end}
                                    </span>
                                  </div>
                                )}
                                {pooja.cost && (
                                  <div className="flex items-center">
                                    <Tag className="w-4 h-4 mr-1 text-gray-500" />
                                    <span className="text-sm text-gray-600">{pooja.cost}</span>
                                  </div>
                                )}
                                {pooja.booking_allowed && (
                                  <Badge variant="outline" className="text-green-600">
                                    Booking Available
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-600">No pooja information available.</p>
                  )}
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="mt-0">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold">Donations & Payments</h2>
                  {listing.seeking_donations ? (
                    <div className="mt-4 space-y-6">
                      {/* UPI Details */}
                      {listing.upi_id && (
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-lg font-medium">UPI Payment</h3>
                          <div className="flex items-center mt-2">
                            <div className="flex-1">
                              <p className="text-gray-700">UPI ID: {listing.upi_id}</p>
                            </div>
                            {listing.upi_qr_code && (
                              <div className="relative w-24 h-24">
                                <Image
                                  src={listing.upi_qr_code || "/placeholder.svg"}
                                  alt="UPI QR Code"
                                  fill
                                  className="object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg"
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bank Details */}
                      {listing.bank_account_name && (
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-lg font-medium">Bank Transfer</h3>
                          <div className="mt-2 space-y-2">
                            <p className="text-gray-700">
                              <span className="font-medium">Account Name:</span> {listing.bank_account_name}
                            </p>
                            {listing.bank_account_number && (
                              <p className="text-gray-700">
                                <span className="font-medium">Account Number:</span> {listing.bank_account_number}
                              </p>
                            )}
                            {listing.bank_ifsc_code && (
                              <p className="text-gray-700">
                                <span className="font-medium">IFSC Code:</span> {listing.bank_ifsc_code}
                              </p>
                            )}
                            {listing.bank_branch_name && (
                              <p className="text-gray-700">
                                <span className="font-medium">Branch:</span> {listing.bank_branch_name}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment Methods */}
                      {listing.payment_methods && (
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-lg font-medium">Accepted Payment Methods</h3>
                          <div className="mt-2">
                            {typeof listing.payment_methods === "string" ? (
                              <p className="text-gray-700">{listing.payment_methods}</p>
                            ) : typeof listing.payment_methods === "object" && listing.payment_methods !== null ? (
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(listing.payment_methods)
                                  .filter(([_, value]) => value)
                                  .map(([key]) => (
                                    <Badge key={key} variant="outline">
                                      {key.replace(/_/g, " ").toUpperCase()}
                                    </Badge>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-gray-600">No payment method information available.</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700">Important Notice</h3>
                        <p className="mt-1 text-xs text-gray-600">
                          The payment details displayed on this page belong to the temple or organization's official
                          accounts. Please verify the details before making any payment. Temple Address does not hold
                          any liabilities or involvement in the financial transactions made.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-600">This temple is not currently accepting online donations.</p>
                  )}
                </div>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="mt-0">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold">Additional Information</h2>

                  {/* History */}
                  {listing.history && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">History</h3>
                      <p className="mt-2 text-gray-700 leading-relaxed">{listing.history}</p>
                    </div>
                  )}

                  {/* Story */}
                  {listing.story && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Story</h3>
                      <p className="mt-2 text-gray-700 leading-relaxed">{listing.story}</p>
                    </div>
                  )}

                  {/* Speciality */}
                  {listing.speciality && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Speciality</h3>
                      <p className="mt-2 text-gray-700 leading-relaxed">{listing.speciality}</p>
                    </div>
                  )}

                  {/* Remarks */}
                  {listing.remarks && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Visitor Information</h3>
                      <p className="mt-2 text-gray-700 leading-relaxed">{listing.remarks}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">Quick Information</h2>
                <div className="mt-4 space-y-3">
                  {(listing.location || listing.state || listing.country) && (
                    <div className="flex">
                      <MapPin className="w-5 h-5 mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-gray-600">
                          {[listing.location, listing.state, listing.country].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {listing.category && (
                    <div className="flex">
                      <Info className="w-5 h-5 mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Category</p>
                        <p className="text-sm text-gray-600">{listing.category.name}</p>
                      </div>
                    </div>
                  )}

                  {listing.main_deity && (
                    <div className="flex">
                      <Info className="w-5 h-5 mt-1 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Main Deity</p>
                        <p className="text-sm text-gray-600">{listing.main_deity.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Temple Timings Card */}
              {(listing.morning || listing.midday || listing.evening) && (
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold">Temple Timings</h2>
                  <div className="mt-4 space-y-3">
                    {listing.morning && (
                      <div className="flex">
                        <Clock className="w-5 h-5 mt-1 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Morning</p>
                          <p className="text-sm text-gray-600">{listing.morning}</p>
                        </div>
                      </div>
                    )}

                    {listing.midday && (
                      <div className="flex">
                        <Clock className="w-5 h-5 mt-1 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Midday</p>
                          <p className="text-sm text-gray-600">{listing.midday}</p>
                        </div>
                      </div>
                    )}

                    {listing.evening && (
                      <div className="flex">
                        <Clock className="w-5 h-5 mt-1 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Evening</p>
                          <p className="text-sm text-gray-600">{listing.evening}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Card */}
              {(listing.contact_number || listing.email || listing.website) && (
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold">Contact</h2>
                  <div className="mt-4 space-y-3">
                    {listing.contact_number && (
                      <div className="flex">
                        <Phone className="w-5 h-5 mt-1 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-gray-600">{listing.contact_number}</p>
                        </div>
                      </div>
                    )}

                    {listing.email && (
                      <div className="flex">
                        <Mail className="w-5 h-5 mt-1 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-600">{listing.email}</p>
                        </div>
                      </div>
                    )}

                    {listing.website && (
                      <div className="flex">
                        <Globe className="w-5 h-5 mt-1 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Website</p>
                          <Link
                            href={listing.website}
                            className="text-sm text-blue-600 hover:underline"
                            target="_blank"
                          >
                            {listing.website.replace(/^https?:\/\//, "")}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Media Card */}
              {(listing.facebook || listing.twitter || listing.instagram || listing.youtube) && (
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold">Social Media</h2>
                  <div className="flex flex-wrap mt-4 space-x-4">
                    {listing.facebook && (
                      <Link
                        href={listing.facebook}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook size={24} />
                        <span className="sr-only">Facebook</span>
                      </Link>
                    )}
                    {listing.twitter && (
                      <Link
                        href={listing.twitter}
                        className="text-blue-400 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter size={24} />
                        <span className="sr-only">Twitter</span>
                      </Link>
                    )}
                    {listing.instagram && (
                      <Link
                        href={listing.instagram}
                        className="text-pink-600 hover:text-pink-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram size={24} />
                        <span className="sr-only">Instagram</span>
                      </Link>
                    )}
                    {listing.youtube && (
                      <Link
                        href={listing.youtube}
                        className="text-red-600 hover:text-red-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Youtube size={24} />
                        <span className="sr-only">YouTube</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Social Share Button */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Share on Social Media</h3>

                <div className="relative" id="share-dropdown-container">
                  {/* Main Share Button */}
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Temple Details
                  </Button>

                  {/* Share Dropdown */}
                  {isShareDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 overflow-hidden bg-white border rounded-md shadow-lg">
                      <button
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          copyToClipboard(window.location.href)
                          setIsShareDropdownOpen(false)
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Copy Link
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                            "_blank",
                            "noopener,noreferrer",
                          )
                          setIsShareDropdownOpen(false)
                        }}
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(listing.title)}`,
                            "_blank",
                            "noopener,noreferrer",
                          )
                          setIsShareDropdownOpen(false)
                        }}
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(listing.title + ": " + window.location.href)}`,
                            "_blank",
                            "noopener,noreferrer",
                          )
                          setIsShareDropdownOpen(false)
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </button>
                    </div>
                  )}
                </div>

                {listing.whatsapp && (
                  <Button
                    className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact on WhatsApp
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

// Loading skeleton component
function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Banner Skeleton */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="container px-4 mx-auto">
        <div className="mt-6">
          {/* Tabs Skeleton */}
          <div className="grid w-full grid-cols-6 gap-2 mb-8 h-10">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-md" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Skeleton className="h-[600px] rounded-lg" />
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
