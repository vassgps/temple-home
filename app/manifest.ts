import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Temple Address",
    short_name: "Temple Address",
    description: "Your guide to sacred places in India",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    icons: [
      {
        src: "/fav.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/fav.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
