"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnection } from "@/components/wallet-connection-new"

export function ResponsiveHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout: Stacked vertically on screens < 600px */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Top row: Logo and theme toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <span className="text-lg" role="img" aria-label="Globe">
                  🌍
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-balance truncate">Serragates Ventures</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Bottom row: Tagline and wallet button */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">Invest in Impact. Power the SDGs.</p>
            <div className="flex justify-center">
              <WalletConnection />
            </div>
          </div>
        </div>

        {/* Tablet and Desktop Layout: Horizontal on screens >= 600px */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg" role="img" aria-label="Globe">
                🌍
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-balance">Serragates Ventures</h1>
              <p className="text-sm text-muted-foreground hidden md:block">Invest in Impact. Power the SDGs.</p>
            </div>
          </div>

          {/* Center: Site name and tagline (for larger screens) */}
          <div className="hidden lg:flex flex-col items-center text-center flex-1 max-w-md">
            <h2 className="text-lg font-semibold text-balance">Impact Token Sale</h2>
            <p className="text-sm text-muted-foreground">Funding sustainable solutions worldwide</p>
          </div>

          {/* Right: Theme Toggle + Wallet Connection */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <WalletConnection />
          </div>
        </div>
      </div>
    </header>
  )
}
