"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, IndianRupee, AlertTriangle } from "lucide-react"

interface Pooja {
  uuid: string
  name: string
  details?: string
  image?: string | null
  cost?: string | null
  timing?: {
    start?: string
    end?: string
  }
  remarks?: string | null
  booking_allowed?: boolean
}

interface ListingPoojasProps {
  poojas: Pooja[]
}

export default function ListingPoojas({ poojas }: ListingPoojasProps) {
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null)
  const [bookingDate, setBookingDate] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [contact, setContact] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (uuid: string) => {
    setImageErrors((prev) => ({ ...prev, [uuid]: true }))
  }

  const handleBooking = () => {
    try {
      // In a real implementation, this would submit to the API
      console.log("Booking submitted:", { selectedPooja, bookingDate, name, contact })
      // Reset form
      setSelectedPooja(null)
      setBookingDate("")
      setName("")
      setContact("")
      setError(null)
    } catch (error) {
      console.error("Error submitting booking:", error)
      setError("Failed to submit booking. Please try again.")
    }
  }

  // If no poojas, show message
  if (!poojas || poojas.length === 0) {
    return (
      <div className="p-8 mt-4 text-center bg-gray-50 rounded-md">
        <p className="text-gray-500">No poojas available for this listing.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {poojas.map((pooja) => (
          <Card key={pooja.uuid} className="overflow-hidden">
            <div className="flex">
              <div className="relative w-1/3 h-auto">
                {imageErrors[pooja.uuid] || !pooja.image ? (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 min-h-[120px]">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={pooja.image || "/placeholder.svg"}
                    alt={pooja.name}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                    onError={() => handleImageError(pooja.uuid)}
                  />
                )}
              </div>
              <div className="w-2/3">
                <CardHeader className="pb-2">
                  <CardTitle>{pooja.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  {pooja.details && <p className="text-sm text-gray-600">{pooja.details}</p>}
                  {pooja.timing && (pooja.timing.start || pooja.timing.end) && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        {pooja.timing.start || "N/A"} - {pooja.timing.end || "N/A"}
                      </span>
                    </div>
                  )}
                  {pooja.cost && (
                    <div className="flex items-center mt-1 text-sm font-medium">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span>₹{pooja.cost}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {pooja.booking_allowed ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedPooja(pooja)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book {pooja.name}</DialogTitle>
                          <DialogDescription>Fill in the details below to book this pooja.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="date" className="text-right">
                              Date
                            </Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="col-span-3"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="contact" className="text-right">
                              Contact
                            </Label>
                            <Input
                              id="contact"
                              value={contact}
                              onChange={(e) => setContact(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleBooking}>
                            Confirm Booking
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Booking Not Available
                    </Button>
                  )}
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
