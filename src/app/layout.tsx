import type { Metadata, Viewport } from "next"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { ConditionalNavbar } from '@/components/ConditionalNavbar'
import { PlausibleAnalytics } from '@/components/PlausibleAnalytics'
import { Providers } from './providers'

/** BinanceNova substitute — Inter */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/** BinancePlex substitute — IBM Plex Mono (tabular numerical type) */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-plex',
  display: 'swap',
})

const siteUrl = "https://prostep2market.com"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProStep2Market — AI-Powered Trader Development",
    template: "%s | ProStep2Market",
  },
  description: "Transform your trading with AI behavioral analytics, discipline coaching, and performance intelligence. Understand yourself before trying to understand the market.",
  keywords: ["trading journal", "trading analytics", "AI trading", "trader development", "edge score", "trading discipline", "MetaTrader 5", "trading psychology", "risk management", "prop firm"],
  authors: [{ name: "ProStep2Market" }],
  creator: "ProStep2Market",
  publisher: "ProStep2Market",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ProStep2Market",
    title: "ProStep2Market — AI-Powered Trader Development",
    description: "Transform your trading with AI behavioral analytics, discipline coaching, and performance intelligence.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ProStep2Market" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProStep2Market — AI-Powered Trader Development",
    description: "Transform your trading with AI behavioral analytics, discipline coaching, and performance intelligence.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/api/branding-css" />
      </head>
      <body>
        <PlausibleAnalytics />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#fcd535] focus:text-[#0b0e11] focus:rounded-md focus:outline-none">
          Skip to main content
        </a>
        <Providers>
          <ConditionalNavbar />
          <div id="main-content">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
