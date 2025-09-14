"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { getEthBalance, getTokenBalance, getTokenSymbol } from "@/lib/web3-utils"

interface UserBalanceProps {
  isConnected: boolean
  account: string
}

export function UserBalance({ isConnected, account }: UserBalanceProps) {
  const [balances, setBalances] = useState({
    eth: "0.0",
    impt: "0",
  })
  const [tokenSymbol, setTokenSymbol] = useState("IMPT")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch user balances from contracts
  const fetchBalances = async () => {
    if (!isConnected || !account) return

    setIsLoading(true)
    try {
      console.log("[v0] Fetching balances for:", account)

      const [ethBalance, tokenBalance, symbol] = await Promise.all([
        getEthBalance(account),
        getTokenBalance(account),
        getTokenSymbol(),
      ])

      console.log("[v0] Balances fetched:", { ethBalance, tokenBalance, symbol })

      setBalances({
        eth: Number.parseFloat(ethBalance).toFixed(4),
        impt: Number.parseInt(tokenBalance).toString(),
      })
      setTokenSymbol(symbol)
    } catch (error) {
      console.error("[v0] Error fetching balances:", error)
      // Keep existing balances on error
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch balances when connected
  useEffect(() => {
    if (isConnected && account) {
      fetchBalances()
    } else {
      setBalances({ eth: "0.0", impt: "0" })
    }
  }, [isConnected, account])

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">Connect your wallet to view balances</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg text-primary">💼</span>
            Wallet Balance
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchBalances} disabled={isLoading}>
            <span className={`text-lg ${isLoading ? "animate-spin" : ""}`}>🔄</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ETH Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">ETH</span>
            </div>
            <div>
              <p className="font-medium">Ethereum</p>
              <p className="text-xs text-muted-foreground">Sepolia Testnet</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{balances.eth}</p>
            <p className="text-xs text-muted-foreground">ETH</p>
          </div>
        </div>

        <Separator />

        {/* IMPT Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg text-primary">🪙</span>
            </div>
            <div>
              <p className="font-medium">Impact Token</p>
              <p className="text-xs text-muted-foreground">{tokenSymbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{Number.parseInt(balances.impt).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{tokenSymbol}</p>
          </div>
        </div>

        {/* Account Info */}
        <Separator />
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Connected Account</p>
          <Badge variant="outline" className="font-mono text-xs w-full justify-center">
            {account.slice(0, 6)}...{account.slice(-4)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
