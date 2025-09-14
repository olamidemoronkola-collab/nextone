import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { Web3Providers } from "@/components/web3-providers"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Impact Token Sale - Sustainable Development Goals",
  description: "Join the Impact Token Sale supporting UN Sustainable Development Goals",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Web3Providers>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </Web3Providers>
      </body>
    </html>
  )
}
