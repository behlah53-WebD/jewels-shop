import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aurelia Jewels | Contemporary Heirlooms",
    short_name: "Aurelia",
    description:
      "Aurelia Jewels — contemporary heirlooms in gold, diamond, and vivid colour.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a100d",
    theme_color: "#163a2b",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
