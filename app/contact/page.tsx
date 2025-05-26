import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, MapPin, Phone, Mail, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-center text-gray-900">Contact Us</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Get in Touch</h2>
              <p className="mb-6 text-gray-800">
                Have questions about Temple Address? We're here to help! Reach out to us using any of the methods below.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-800">18/505H, Mayanad, Kerala, India - 673008</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-800">+91 9495041196</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-800">
                      <a href="mailto:info@vass.co.in" className="hover:underline">
                        info@vass.co.in
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium text-gray-900">Social Media</h3>
                    <div className="flex mt-2 space-x-4">
                      <Link
                        href="https://wa.me/919495041196"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </Link>
                      <Link
                        href="https://t.me/templeaddress_bot?start=assist"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M21.5 2l-19 9 5.7 2.8L18.5 6l-8.5 9.5 4.5 3.5L21.5 2z"></path>
                        </svg>
                      </Link>
                      <Link
                        href="https://forms.gle/5uJjY89HccCSWTFm7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">Submit Your Details</h2>
              <p className="mb-6 text-center text-gray-800">
                Fill out our Google Form to join our community or share your feedback.
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
          </div>

          <div>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Send a Message</h2>

              {/* Option 1: FormSubmit.co integration */}
              <form action="https://formsubmit.co/info@vass.co.in" method="POST" className="space-y-4">
                {/* FormSubmit configuration */}
                <input type="hidden" name="_subject" value="New Temple Address Contact Form Submission" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input
                  type="hidden"
                  name="_next"
                  value={`${process.env.NEXT_PUBLIC_BASE_URL || "https://templeaddress.com"}/thank-you`}
                />

                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-1 text-sm font-medium text-gray-900">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-900">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your message"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Or use our Google Form for more detailed submissions</p>
                <Link
                  href="https://forms.gle/5uJjY89HccCSWTFm7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-primary hover:underline"
                >
                  Open Google Form
                </Link>
              </div>
            </div>

            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.019696608428!2d75.8366!3d11.2480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE0JzUyLjgiTiA3NcKwNTAnMTEuOCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Temple Address Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
