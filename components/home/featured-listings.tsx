import type React from "react"
import Link from "next/link"

interface Listing {
  id: string
  title: string
  slug: string
  imageUrl: string
  price: number
  location: string
}

interface FeaturedListingsProps {
  listings: Listing[]
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings }) => {
  return (
    <div className="featured-listings">
      <h2>Featured Listings</h2>
      <div className="listings-grid">
        {listings.map((listing) => (
          <div key={listing.id} className="listing-card">
            <Link href={`/listing/${listing.slug}`} passHref>
              <a>
                <img src={listing.imageUrl || "/placeholder.svg"} alt={listing.title} />
                <h3>{listing.title}</h3>
                <p className="location">{listing.location}</p>
                <p className="price">${listing.price}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedListings
