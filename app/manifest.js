export default function manifest() {
  return {
    name: "ParkSmart — Singapore Parking Optimizer",
    short_name: "ParkSmart",
    description: "Find the most optimal and affordable parking spot near your destination in Singapore",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0E1014",
    theme_color: "#D4A85A",
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
