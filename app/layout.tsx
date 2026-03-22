import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.description,
  openGraph: {
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.description,
    url: BRAND.url,
    siteName: BRAND.name,
    images: [
      {
        url: `${BRAND.url}/icon.svg`,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} brand mark`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#b8860b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="eternal" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-base-200/40 text-base-content font-sans antialiased selection:bg-primary/20 selection:text-base-content",
          jakarta.variable,
          fraunces.variable,
          lora.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
