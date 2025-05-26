import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Calendar, Star } from "lucide-react"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <Image
          src="https://static.wixstatic.com/media/563eb9_68cdcab5daaa4271ade07e4d9adae518~mv2.png/v1/fill/w_1280,h_673,al_c,q_90,enc_avif,quality_auto/563eb9_68cdcab5daaa4271ade07e4d9adae518~mv2.png"
          alt="Temple"
          width={1920}
          height={1080}
          className="w-full h-[600px] object-cover"
          priority
        />
        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col items-center justify-center h-[600px] text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Discover Sacred Places</h1>
            <p className="text-lg md:text-xl max-w-3xl mb-8">
              Your comprehensive guide to temples, festivals, and religious services
            </p>

            {/* Search Section - Now on the hero image */}
            <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-white">Find Your Sacred Destination</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search temples, festivals, or services..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <Link href="/search">
                  <Button size="lg" className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white">
                    Search
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                  Explore Now
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Temple Category */}
            <Link href="/search?category=temple">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/11062b_7e5e27c4ad0142b79eee61c0dfc73cd7~mv2.jpeg/v1/fill/w_383,h_325,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Chennai%20City.jpeg"
                    alt="Hindu Temples"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Hindu Temples</h3>
                    <p className="text-sm">Explore sacred shrines</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Holy Places Category */}
            <Link href="/search?category=holy-places">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/nsplsh_17abbe9633c8430c9983bd3f8f400039~mv2.jpg/v1/fill/w_393,h_325,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Sajal%20Das.jpg"
                    alt="Holy Places"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Holy Places</h3>
                    <p className="text-sm">Visit sacred locations</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Festival Category */}
            <Link href="/search?category=festival">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/d249a458b89f4abeb7079f08b0d1a5ff.jpg/v1/fill/w_393,h_325,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Elephant%20Festival%20in%20India.jpg"
                    alt="Religious Festivals"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Religious Festivals</h3>
                    <p className="text-sm">Celebrate cultural events</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Services Category */}
            <Link href="/search?category=service">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/dcc6cdb656664c93ac01510287e00bb3.png/v1/fill/w_394,h_325,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Astrology%20Map.png"
                    alt="Religious Services"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Religious Services</h3>
                    <p className="text-sm">Find poojas and rituals</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Temples Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Temples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Guruvayur Temple - No Link */}
            <Card className="overflow-hidden shadow-md h-full">
              <div className="relative h-48">
                <Image
                  src="https://static.wixstatic.com/media/8133e2_fdf4a9a9f3734482a9bb3a66ac40f00d~mv2.jpg"
                  alt="Guruvayur Temple"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Guruvayur Temple</h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Guruvayur, Kerala</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  One of the most important Krishna temples in Kerala with rich history.
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">(128 reviews)</span>
                </div>
              </CardContent>
            </Card>

            {/* Sabarimala Temple - No Link */}
            <Card className="overflow-hidden shadow-md h-full">
              <div className="relative h-48">
                <Image
                  src="https://static.wixstatic.com/media/8133e2_f41704f12ae447fe8a5e587ae32197bc~mv2.jpeg"
                  alt="Sabarimala Temple"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Sabarimala Temple</h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Pathanamthitta, Kerala</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Famous pilgrimage site dedicated to Lord Ayyappa in the Western Ghats.
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">(96 reviews)</span>
                </div>
              </CardContent>
            </Card>

            {/* Padmanabhaswamy Temple - No Link */}
            <Card className="overflow-hidden shadow-md h-full">
              <div className="relative h-48">
                <Image
                  src="https://static.wixstatic.com/media/8133e2_f6581cd3ca8c4761bc05abe4e16eaed5~mv2.jpg"
                  alt="Padmanabhaswamy Temple"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Padmanabhaswamy Temple</h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Thiruvananthapuram, Kerala</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Ancient temple dedicated to Lord Vishnu with remarkable architecture.
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">(142 reviews)</span>
                </div>
              </CardContent>
            </Card>

            {/* Kottiyur MahaDeva Temple - No Link */}
            <Card className="overflow-hidden shadow-md h-full">
              <div className="relative h-48">
                <Image
                  src="https://static.wixstatic.com/media/8133e2_d41ce3036b3c47deb82ede818f4757ff~mv2.jpg"
                  alt="Kottiyur MahaDeva Temple"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">Kottiyur MahaDeva Temple</h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Kannur, Kerala</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Ancient temple dedicated to Lord Shiva in the serene forests of Kannur.
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">(98 reviews)</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-10">
            <Link href="/search">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">View All Temples</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Festivals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Festivals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thrissur Pooram */}
            <Link href="/search?q=thrissur-pooram">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_2c5bdebad7f846828ffcc81c71029de1~mv2.jpg"
                    alt="Thrissur Pooram"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2">Thrissur Pooram</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">April 19, 2023</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Spectacular annual temple festival with elephants and traditional music.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Theyyam */}
            <Link href="/search?q=theyyam">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_3bcac90439984e87a19e89072609df58~mv2.jpg"
                    alt="Theyyam"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2">Theyyam</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">November - May, 2023</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ancient ritual dance form of North Kerala with elaborate costumes.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Nenmara Vela */}
            <Link href="/search?q=nenmara-vela">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_681309729ef44984b122a22db998d2e2~mv2.jpg"
                    alt="Nenmara Vela"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2">Nenmara Vela</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">March 23, 2023</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Famous temple festival in Palakkad with magnificent elephant processions.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Thira Festivals */}
            <Link href="/search?q=thira-festivals">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-48">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_d3a37e6863ad4f129ca02418b9e40151~mv2.jpg"
                    alt="Thira Festivals"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2">Thira Festivals</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Throughout the year</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Traditional ritual performances honoring local deities in Kerala.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="text-center mt-10">
            <Link href="/search?category=festival">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">View All Festivals</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Varanasi */}
            <Link href="/search?location=varanasi">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-64">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_3b21684a041445f6b8424bc536424655~mv2.jpeg"
                    alt="Varanasi"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Varanasi</h3>
                    <p className="text-sm">The Spiritual Capital</p>
                    <div className="mt-2 inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">
                      80+ Temples
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Rameswaram */}
            <Link href="/search?location=rameswaram">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-64">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_75c0624d5b974273bdb210fd89e07820~mv2.jpeg"
                    alt="Rameswaram"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Rameswaram</h3>
                    <p className="text-sm">Island of Pilgrimage</p>
                    <div className="mt-2 inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">
                      40+ Temples
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Ayodhya */}
            <Link href="/search?location=ayodhya">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-64">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_381987c5d3974371b1059e6429dae18f~mv2.jpg"
                    alt="Ayodhya"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Ayodhya</h3>
                    <p className="text-sm">Birthplace of Lord Rama</p>
                    <div className="mt-2 inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">
                      50+ Temples
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Kedarnath */}
            <Link href="/search?location=kedarnath">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                <div className="relative h-64">
                  <Image
                    src="https://static.wixstatic.com/media/8133e2_ce8593c586b847a3909f05535b6877cc~mv2.jpeg"
                    alt="Kedarnath"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">Kedarnath</h3>
                    <p className="text-sm">Himalayan Shrine</p>
                    <div className="mt-2 inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">
                      20+ Temples
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Rahul Sharma</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Temple Address made planning my pilgrimage to Varanasi so much easier. I found all the information I
                  needed about temples, rituals, and accommodations in one place."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Priya Patel</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As someone new to Hindu traditions, this platform has been invaluable. The detailed information about
                  festivals and rituals helped me understand and appreciate the cultural significance."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Arun Menon</h3>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The temple booking feature saved me hours of waiting in line. I was able to schedule my pooja in
                  advance and had a seamless experience at the temple. Highly recommended!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore Sacred India?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Join thousands of pilgrims and travelers discovering temples, festivals, and spiritual experiences across
            India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
