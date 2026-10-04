import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Providers from "./providers";
import AppHeader from "@/components/layout/AppHeader";
import MobileNavigation from "@/components/layout/MobileNavigation";
import PwaRegistrar from "@/components/layout/PwaRegistrar";
import OnboardingDialog from "@/components/onboarding/OnboardingDialog";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "PingMe — Your AI Memory Companion",
    template: "%s | PingMe",
  },
  description:
    "Dump what’s on your mind. PingMe turns everyday thoughts into tasks, reminders and events using open-weight AI.",
  applicationName: "PingMe",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PingMe" },
  openGraph: {
    title: "PingMe — Your AI Memory Companion",
    description: "Say it. Forget it. We’ll remember.",
    type: "website",
    images: ["/opengraph-image"],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0E14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.variable}>
        <Providers>
          <AppHeader />
          <main>{children}</main>
          <MobileNavigation />
          <OnboardingDialog />
          <PwaRegistrar />
        </Providers>
      </body>
    </html>
  );
}
