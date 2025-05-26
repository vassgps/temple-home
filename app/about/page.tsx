import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-center text-gray-900">About Temple Address</h1>

        <div className="mb-12">
          <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=1000&auto=format&fit=crop"
              alt="Temple Address Mission"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Our Mission</h2>
          <p className="mb-4 text-gray-800">
            Temple Address is dedicated to preserving and promoting India's rich spiritual heritage by connecting
            devotees with sacred places across the country. Our mission is to make spiritual journeys more accessible,
            informed, and meaningful for everyone.
          </p>
          <p className="text-gray-800">
            We aim to be the most comprehensive and reliable resource for information about temples, religious
            festivals, and spiritual services throughout India, helping both locals and tourists discover and experience
            the divine.
          </p>
        </div>

        <div className="mb-12">
          <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?q=80&w=1000&auto=format&fit=crop"
              alt="Temple Address Story"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Our Story</h2>
          <p className="mb-4 text-gray-800">
            Temple Address was founded in 2023 by a group of technology enthusiasts and spiritual seekers who recognized
            the need for a centralized platform that could bridge the gap between ancient traditions and modern
            technology.
          </p>
          <p className="mb-4 text-gray-800">
            What began as a simple directory of temples in Kerala has grown into a comprehensive platform covering
            sacred places across India, with plans to expand our coverage to include more spiritual destinations and
            services.
          </p>
          <p className="text-gray-800">
            Our journey is guided by our commitment to accuracy, respect for diverse traditions, and a passion for
            making India's spiritual heritage accessible to all.
          </p>
        </div>

        <div className="p-6 mb-12 bg-amber-50 rounded-lg">
          <h2 className="mb-4 text-2xl font-semibold text-center text-gray-900">Submit Your Details</h2>
          <p className="mb-6 text-center text-gray-800">
            We'd love to hear from you! Fill out our form to join our community or share your feedback.
          </p>
          <div className="flex justify-center">
            <Link href="https://forms.gle/5uJjY89HccCSWTFm7" target="_blank" rel="noopener noreferrer">
              <Button className="flex items-center bg-primary hover:bg-primary/90">
                <FileText className="w-5 h-5 mr-2" />
                Submit Your Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Our Values</h2>
          <ul className="pl-6 space-y-2 list-disc text-gray-800">
            <li>
              <strong>Respect for Tradition:</strong> We honor the diverse spiritual traditions of India and strive to
              represent them accurately and respectfully.
            </li>
            <li>
              <strong>Accessibility:</strong> We believe that spiritual knowledge should be accessible to all,
              regardless of background or location.
            </li>
            <li>
              <strong>Community:</strong> We foster a community of devotees, travelers, and spiritual seekers who can
              share experiences and support each other's journeys.
            </li>
            <li>
              <strong>Innovation:</strong> We embrace technology as a tool to preserve and promote ancient traditions in
              the modern world.
            </li>
            <li>
              <strong>Accuracy:</strong> We are committed to providing accurate, up-to-date information about temples,
              festivals, and services.
            </li>
          </ul>
        </div>

        <div className="p-6 text-center bg-primary rounded-lg">
          <h2 className="mb-4 text-2xl font-semibold text-white">Join Us on This Sacred Journey</h2>
          <p className="mb-6 text-white font-medium">
            Whether you're a devotee seeking connection, a traveler exploring India's spiritual landscape, or a temple
            administrator looking to reach more people, Temple Address is here to support your journey.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <Link href="/search">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold">Start Exploring</Button>
            </Link>
            <Link href="https://forms.gle/5uJjY89HccCSWTFm7" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white text-white hover:bg-white/20 font-semibold">
                Submit Your Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
