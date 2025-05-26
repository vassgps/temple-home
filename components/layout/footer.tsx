import Link from "next/link"
import Image from "next/image"
import { SocialButtons } from "./social-buttons"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="https://static.wixstatic.com/media/563eb9_c01c820ded5d43f6b2a8a534d6bf74d2~mv2.jpg/v1/fill/w_176,h_178,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fav_edited.jpg"
                alt="Temple Address"
                width={100}
                height={100}
                className="h-24 w-24 rounded-full"
              />
            </Link>
            <p className="text-gray-400 text-sm">
              Your comprehensive guide to temples, festivals, and religious services across India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search?category=temple" className="text-gray-400 hover:text-white transition-colors">
                  Temples
                </Link>
              </li>
              <li>
                <Link href="/search?category=festival" className="text-gray-400 hover:text-white transition-colors">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/search?category=pilgrimage" className="text-gray-400 hover:text-white transition-colors">
                  Pilgrimages
                </Link>
              </li>
              <li>
                <Link href="/search?category=service" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <SocialButtons />
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>Parent Company: VASS Systems LLP</p>
          <p>VASS Arcade, P.O. Mayanad, Kozhikode-673010</p>
          <p className="mt-4">&copy; {new Date().getFullYear()} Temple Address. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
