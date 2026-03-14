import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "Eternal Memory - Honor and Remember Loved Ones",
  description: "A luxury memorial platform to create lasting tributes, share memories, and host virtual services for your loved ones.",
  openGraph: {
    title: "Eternal Memory - Honor and Remember Loved Ones",
    description: "Create lasting tributes, share memories, and host virtual services.",
    url: "https://eternalmemory.com",
    siteName: "Eternal Memory",
    images: [
      {
        url: "https://eternalmemory.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eternal Memory Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#D4AF37",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        playfair.variable,
        cormorant.variable
      )}>
        {children}
      </body>
    </html>
  );
}
