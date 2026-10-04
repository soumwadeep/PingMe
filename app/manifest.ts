import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PingMe — Your AI Memory Companion",
    short_name: "PingMe",
    description: "Say it. Forget it. We’ll remember.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8FC",
    theme_color: "#635BFF",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
