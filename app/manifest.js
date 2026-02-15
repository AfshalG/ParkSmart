export default function manifest() {
  return {
    name: "ParkSmart — Singapore Parking Optimizer",
    short_name: "ParkSmart",
    description: "Find the most optimal and affordable parking spot near your destination in Singapore",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0E1A",
    theme_color: "#6366F1",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
