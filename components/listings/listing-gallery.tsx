"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"

interface GalleryItem {
  uuid: string
  file: string
  file_type: string
  meta_description?: string
}

interface ListingGalleryProps {
  galleryItems: GalleryItem[]
}

export default function ListingGallery({ galleryItems }: ListingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const handleImageError = (uuid: string) => {
    setImageError((prev) => ({ ...prev, [uuid]: true }))
  }

  // If no gallery items, show placeholder
  if (!galleryItems || galleryItems.length === 0) {
    return (
      <div className="mt-4 text-center">
        <p className="text-gray-500">No gallery images available for this listing.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {galleryItems.map((item) => (
          <Dialog key={item.uuid}>
            <DialogTrigger asChild>
              <div
                className="relative h-48 overflow-hidden transition-transform cursor-pointer rounded-md hover:opacity-90 hover:scale-[1.02]"
                onClick={() => setSelectedImage(item.file)}
              >
                {imageError[item.uuid] ? (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={item.file || "/placeholder.svg"}
                    alt={item.meta_description || "Gallery image"}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(item.uuid)}
                  />
                )}
                {item.meta_description && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white bg-black/50">
                    {item.meta_description}
                  </div>
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden">
              <div className="relative h-[80vh]">
                {imageError[item.uuid] ? (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                    <AlertTriangle className="w-16 h-16 text-gray-400" />
                    <p className="mt-4 text-gray-500">Image could not be loaded</p>
                  </div>
                ) : (
                  <Image
                    src={item.file || "/placeholder.svg"}
                    alt={item.meta_description || "Gallery image"}
                    fill
                    className="object-contain"
                    onError={() => handleImageError(item.uuid)}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/40"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {item.meta_description && (
                <div className="p-4 text-center">
                  <p>{item.meta_description}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
