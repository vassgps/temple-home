"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { IndianRupee, CreditCard, Smartphone, AlertTriangle } from "lucide-react"

interface ListingPaymentsProps {
  listing: any // Using any for simplicity, but should be properly typed in a real app
}

export default function ListingPayments({ listing }: ListingPaymentsProps) {
  const [amount, setAmount] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleDonation = () => {
    try {
      // In a real implementation, this would submit to the API
      console.log("Donation submitted:", { amount, name, email, message })
      // Reset form
      setAmount("")
      setName("")
      setEmail("")
      setMessage("")
      setError(null)
    } catch (error) {
      console.error("Error processing donation:", error)
      setError("Failed to process donation. Please try again.")
    }
  }

  if (!listing.seeking_donations) {
    return (
      <div className="p-8 mt-4 text-center bg-gray-50 rounded-md">
        <p className="text-gray-500">This listing is not currently accepting donations.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <p className="mb-6 text-gray-700">
        Support this temple by making a donation. Your contributions help maintain the temple and support its
        activities.
      </p>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* UPI Payment - Only show if UPI ID is available */}
        {listing.upi_id && (
          <Card>
            <CardHeader>
              <CardTitle>UPI Payment</CardTitle>
              <CardDescription>Make a quick donation using UPI</CardDescription>
            </CardHeader>
            <CardContent>
              {/* UPI ID displayed prominently - Make it clickable */}
              <div
                className="p-3 mb-4 text-center bg-amber-50 border border-amber-200 rounded-md cursor-pointer hover:bg-amber-100 transition-colors"
                onClick={() => {
                  try {
                    // Create UPI payment URL
                    const upiUrl = `upi://pay?pa=${listing.upi_id}&pn=${encodeURIComponent(listing.title)}&cu=INR`

                    // Try to open UPI app
                    window.location.href = upiUrl

                    // Fallback for desktop - show instructions
                    setTimeout(() => {
                      if (window.confirm("UPI app not found. Would you like to copy the UPI ID to clipboard?")) {
                        navigator.clipboard
                          .writeText(listing.upi_id)
                          .then(() => {
                            alert("UPI ID copied to clipboard!")
                          })
                          .catch(() => {
                            prompt("Copy this UPI ID:", listing.upi_id)
                          })
                      }
                    }, 1000)
                  } catch (error) {
                    console.error("Error opening UPI app:", error)
                    // Fallback - copy to clipboard
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(listing.upi_id).then(() => {
                        alert("UPI ID copied to clipboard!")
                      })
                    } else {
                      prompt("Copy this UPI ID:", listing.upi_id)
                    }
                  }
                }}
              >
                <p className="font-medium">UPI ID: (Tap to Pay)</p>
                <p className="text-lg font-bold text-primary hover:text-primary/80">{listing.upi_id}</p>
                <p className="text-xs text-gray-600 mt-1">Tap to open UPI apps like GPay, PhonePe, Paytm</p>
              </div>

              {listing.upi_qr_code || listing.upi_qr_code_url ? (
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <Image
                      src={listing.upi_qr_code || listing.upi_qr_code_url || "/placeholder.svg"}
                      alt="UPI QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center bg-gray-100 rounded-md">
                  <Smartphone className="w-12 h-12 mx-auto text-primary" />
                  <p className="mt-2 font-medium">Scan or enter UPI ID in your payment app</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  try {
                    // Create UPI payment URL with better parameters
                    const upiUrl = `upi://pay?pa=${listing.upi_id}&pn=${encodeURIComponent(listing.title)}&mc=0000&tid=${Date.now()}&cu=INR`

                    // Try to open UPI app
                    window.location.href = upiUrl

                    // Fallback for desktop or if no UPI app is found
                    setTimeout(() => {
                      if (window.confirm("UPI app not found. Would you like to copy the UPI ID to clipboard?")) {
                        navigator.clipboard
                          .writeText(listing.upi_id)
                          .then(() => {
                            alert("UPI ID copied to clipboard!")
                          })
                          .catch(() => {
                            prompt("Copy this UPI ID:", listing.upi_id)
                          })
                      }
                    }, 1000)
                  } catch (error) {
                    console.error("Error opening UPI app:", error)
                    setError("Failed to open UPI app. UPI ID copied to clipboard.")
                    // Fallback - copy to clipboard
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(listing.upi_id)
                    }
                  }
                }}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Open UPI App
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Online Donation */}
        <Card>
          <CardHeader>
            <CardTitle>Online Donation</CardTitle>
            <CardDescription>Make a donation using credit/debit card</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Highlight UPI ID in Online Donation section too */}
            {listing.upi_id && (
              <div className="p-3 mb-4 text-sm text-center bg-gray-50 border border-gray-200 rounded-md">
                <p>
                  You can also donate directly via UPI: <span className="font-bold">{listing.upi_id}</span>
                </p>
              </div>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make a Donation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make a Donation</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to make a donation to {listing.title}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <div className="relative col-span-3">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8"
                        placeholder="Enter amount"
                        min="1"
                      />
                    </div>
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
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="message" className="text-right">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="col-span-3"
                      placeholder="Optional message"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleDonation}>
                    Proceed to Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="text-sm text-gray-500">Your donation will be used for temple maintenance and activities.</p>
            <div className="flex items-center mt-2 space-x-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Suggested amounts: ₹101, ₹501, ₹1001, ₹5001</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Bank Details - Only show if bank details are available */}
      {(listing.bank_account_number || listing.bank_ifsc_code) && (
        <div className="p-6 mt-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">Bank Transfer Details</h3>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            {listing.bank_account_name && (
              <div>
                <p className="text-sm font-medium text-gray-500">Account Name</p>
                <p>{listing.bank_account_name}</p>
              </div>
            )}
            {listing.bank_account_number && (
              <div>
                <p className="text-sm font-medium text-gray-500">Account Number</p>
                <p>{listing.bank_account_number}</p>
              </div>
            )}
            {listing.bank_ifsc_code && (
              <div>
                <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                <p>{listing.bank_ifsc_code}</p>
              </div>
            )}
            {listing.bank_branch_name && (
              <div>
                <p className="text-sm font-medium text-gray-500">Branch</p>
                <p>{listing.bank_branch_name}</p>
              </div>
            )}
          </div>
          {listing.payment_methods && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Payment Methods Accepted</p>
              <p>{listing.payment_methods}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
