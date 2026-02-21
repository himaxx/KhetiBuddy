import type React from "react"
import "@/app/globals.css"
import { Mona_Sans as FontSans } from "next/font/google"
import { Roboto } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import Navigation from "@/components/navigation"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
})

export const metadata = {
  title: "CropSaviour | AI-Powered Smart Agriculture Assistant",
  description: "Advanced plant health monitoring and disease detection using state-of-the-art AI. Get instant diagnostics and treatment recommendations for your crops.",
  keywords: ["agriculture", "AI", "plant health", "crop disease detection", "smart farming", "CropSaviour"],
  authors: [{ name: "CropSaviour Team" }],
  openGraph: {
    title: "CropSaviour - AI Plant Health Assistant",
    description: "Your intelligent companion for plant health monitoring and disease detection.",
    url: "https://cropsaviour.vercel.app",
    siteName: "CropSaviour",
    images: [
      {
        url: "/Home.jpg",
        width: 1200,
        height: 630,
        alt: "CropSaviour Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CropSaviour | AI Plant Health Assistant",
    description: "Advanced plant health monitoring and disease detection using AI.",
    images: ["/Home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-roboto antialiased transition-colors duration-300",
          fontSans.variable,
          roboto.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1 overflow-x-hidden">{children}</main>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}