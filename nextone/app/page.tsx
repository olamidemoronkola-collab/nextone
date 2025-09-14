"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletConnection } from "@/components/wallet-connection-new"
import { WalletInfo } from "@/components/wallet-info"
import { TokenBalance } from "@/components/token-balance"
import { TokenPurchase } from "@/components/token-purchase"
import { IDOStats } from "@/components/ido-stats"
import { ResponsiveHeader } from "@/components/responsive-header"
import { useAccount, useChainId } from "wagmi"
import { CONTRACTS } from "@/lib/contracts"

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const isCorrectNetwork = chainId === CONTRACTS.CHAIN_ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <ResponsiveHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 text-center px-2 sm:px-0">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-balance lg:hidden">
            Impact Token Sale
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed">
            Join the movement to fund real-world solutions aligned with the UN Sustainable Development Goals. Every
            token purchase powers measurable impact across communities worldwide.
          </p>
        </div>

        {/* Network Warning */}
        {isConnected && !isCorrectNetwork && (
          <Alert className="mb-4 sm:mb-6 mx-2 sm:mx-0 border-destructive/50 bg-destructive/10">
            <span className="text-orange-500">⚠️</span>
            <AlertDescription className="text-sm">
              Please switch to Ethereum Sepolia testnet to participate in the token sale.
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Connection */}
        <div className="mb-6">
          <WalletConnection />
        </div>

        {/* Main Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Token Purchase - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <TokenPurchase />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Wallet Info */}
            <WalletInfo />

            {/* Token Balance */}
            <TokenBalance />

            {/* IDO Stats */}
            <IDOStats />

            {/* Impact Stats */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-primary">🎯</span>
                  Impact Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Projects Funded</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">SDGs Supported</span>
                  <span className="font-semibold">15/17</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lives Impacted</span>
                  <span className="font-semibold">2.4M+</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Carbon Offset</span>
                  <span className="font-semibold text-primary">1,250 tons</span>
                </div>
              </CardContent>
            </Card>

            {/* SDG Goals */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Supported SDGs</CardTitle>
                <CardDescription className="text-sm">
                  UN Sustainable Development Goals we're actively funding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    { name: "No Poverty", color: "bg-[#e5243b] text-white" },
                    { name: "Zero Hunger", color: "bg-[#DDA63A] text-white" },
                    { name: "Good Health", color: "bg-[#4C9F38] text-white" },
                    { name: "Quality Education", color: "bg-[#C5192D] text-white" },
                    { name: "Clean Water", color: "bg-[#26BDE2] text-white" },
                    { name: "Clean Energy", color: "bg-[#FCC30B] text-black" },
                    { name: "Climate Action", color: "bg-[#3F7E44] text-white" },
                    { name: "Life on Land", color: "bg-[#56C02B] text-white" },
                  ].map((goal) => (
                    <Badge
                      key={goal.name}
                      className={`text-xs px-2 py-1 border-0 ${goal.color} hover:opacity-90 transition-opacity`}
                    >
                      {goal.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About Section */}
        <Card className="mt-8 sm:mt-12">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">About Impact Tokens</CardTitle>
            <CardDescription className="text-sm">
              Transparent, measurable impact investing powered by blockchain technology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Impact Tokens (IMPT) represent direct investment in verified projects that address the world's most
              pressing challenges. Each token purchase is transparently tracked and allocated to initiatives that create
              measurable positive outcomes aligned with the UN Sustainable Development Goals.
            </p>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm">✅</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base">Verified Impact</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    All projects undergo rigorous verification and impact measurement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm">📈</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base">Transparent Tracking</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Blockchain-based transparency for all fund allocation and outcomes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm">🌍</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base">Global Reach</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Supporting communities and ecosystems across all continents
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-2">
            <p>© 2024 Serragates Ventures. Powering sustainable impact through blockchain technology.</p>
            <p className="break-all sm:break-normal">
              Token Contract: {CONTRACTS.TOKEN_ADDRESS.slice(0, 6)}...{CONTRACTS.TOKEN_ADDRESS.slice(-4)} | 
              IDO Contract: {CONTRACTS.IDO_ADDRESS.slice(0, 6)}...{CONTRACTS.IDO_ADDRESS.slice(-4)} | 
              Network: Ethereum Sepolia Testnet
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
