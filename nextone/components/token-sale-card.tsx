"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getIdoSaleData, buyTokens, getTokenSymbol, getTokenName } from "@/lib/web3-utils"
import { CONTRACTS } from "@/lib/contracts"
import { useTransactionHistory } from "@/hooks/use-transaction-history"

interface TokenSaleCardProps {
  isConnected: boolean
  account: string
  onTransactionUpdate?: () => void
}

interface SaleData {
  tokenPrice: string
  tokensLeft: string
  totalTokens: string
  tokensSold: string
  saleStart: Date
  saleEnd: Date
  minContribution: string
  maxContribution: string
  tokenName?: string
  tokenSymbol?: string
}

export function TokenSaleCard({ isConnected, account, onTransactionUpdate }: TokenSaleCardProps) {
  const [ethAmount, setEthAmount] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [txHash, setTxHash] = useState<string>("")
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [error, setError] = useState<string>("")
  const [lastTransactionTime, setLastTransactionTime] = useState<number>(0)
  const { addTransaction, updateTransactionStatus } = useTransactionHistory()
  const [saleData, setSaleData] = useState<SaleData>({
    tokenPrice: "0.01",
    tokensLeft: "750000",
    totalTokens: "1000000",
    tokensSold: "250000",
    saleStart: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
    saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    minContribution: "0.001",
    maxContribution: "10",
  })

  const fetchSaleData = async () => {
    if (!isConnected) return

    setIsLoadingData(true)
    try {
      const [contractSaleData, tokenName, tokenSymbol] = await Promise.all([
        getIdoSaleData(),
        getTokenName(),
        getTokenSymbol(),
      ])

      setSaleData({
        ...contractSaleData,
        tokenName,
        tokenSymbol,
      })
    } catch (error) {
      console.error("Error fetching sale data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchSaleData()
    }
  }, [isConnected])

  useEffect(() => {
    if (ethAmount && !isNaN(Number.parseFloat(ethAmount))) {
      const tokens = (Number.parseFloat(ethAmount) / Number.parseFloat(saleData.tokenPrice)).toFixed(0)
      setTokenAmount(tokens)
    } else {
      setTokenAmount("")
    }
  }, [ethAmount, saleData.tokenPrice])

  const handleTokenAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "")
    setTokenAmount(sanitizedValue)
    if (sanitizedValue && !isNaN(Number.parseFloat(sanitizedValue))) {
      const eth = (Number.parseFloat(sanitizedValue) * Number.parseFloat(saleData.tokenPrice)).toFixed(6)
      setEthAmount(eth)
    } else {
      setEthAmount("")
    }
  }

  const handleEthAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "")
    setEthAmount(sanitizedValue)
  }

  const progressPercentage = (Number.parseFloat(saleData.tokensSold) / Number.parseFloat(saleData.totalTokens)) * 100

  const getTimeRemaining = () => {
    const now = new Date()
    const timeLeft = saleData.saleEnd.getTime() - now.getTime()

    if (timeLeft <= 0) return "Sale Ended"

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h remaining`
  }

  const isValidAmount = () => {
    if (!ethAmount || isNaN(Number.parseFloat(ethAmount))) return false

    const amount = Number.parseFloat(ethAmount)
    const now = new Date()

    if (now < saleData.saleStart || now > saleData.saleEnd) return false

    if (amount < Number.parseFloat(saleData.minContribution) || amount > Number.parseFloat(saleData.maxContribution))
      return false

    const tokensRequested = amount / Number.parseFloat(saleData.tokenPrice)
    if (tokensRequested > Number.parseFloat(saleData.tokensLeft)) return false

    return true
  }

  const isRateLimited = () => {
    const now = Date.now()
    const timeSinceLastTx = now - lastTransactionTime
    const RATE_LIMIT_MS = 30000 // 30 seconds between transactions
    return timeSinceLastTx < RATE_LIMIT_MS
  }

  const getSaleStatus = () => {
    const now = new Date()
    if (now < saleData.saleStart) return "not_started"
    if (now > saleData.saleEnd) return "ended"
    if (Number.parseFloat(saleData.tokensLeft) <= 0) return "sold_out"
    return "active"
  }

  const handleBuyTokens = async () => {
    if (!isConnected || !isValidAmount() || isRateLimited()) return

    const saleStatus = getSaleStatus()
    if (saleStatus !== "active") {
      setError(`Sale is ${saleStatus.replace("_", " ")}`)
      return
    }

    setIsLoading(true)
    setTxStatus("pending")
    setError("")
    setTxHash("")
    setLastTransactionTime(Date.now())

    try {
      console.log("[v0] Starting token purchase:", { ethAmount, tokenAmount, account })

      const tx = await buyTokens(ethAmount)
      setTxHash(tx.hash)

      addTransaction({
        hash: tx.hash,
        status: "pending",
        ethAmount,
        tokenAmount,
      })

      console.log("[v0] Transaction submitted:", tx.hash)

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Transaction timeout")), 300000) // 5 minutes
      })

      const receipt = (await Promise.race([tx.wait(), timeoutPromise])) as any

      if (receipt.status === 1) {
        setTxStatus("success")
        updateTransactionStatus(tx.hash, "success", receipt.blockNumber)
        console.log("[v0] Transaction confirmed:", receipt)

        setEthAmount("")
        setTokenAmount("")

        await fetchSaleData()
        onTransactionUpdate?.()
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error: any) {
      console.error("[v0] Error buying tokens:", error)
      setTxStatus("error")

      if (txHash) {
        updateTransactionStatus(txHash, "failed")
      }

      if (error.message?.includes("timeout")) {
        setError("Transaction timeout - please check Etherscan for status")
      } else if (error.code === 4001) {
        setError("Transaction rejected by user")
      } else if (error.message?.includes("insufficient funds")) {
        setError("Insufficient ETH balance")
      } else if (error.message?.includes("sale has not started")) {
        setError("Token sale has not started yet")
      } else if (error.message?.includes("sale has ended")) {
        setError("Token sale has ended")
      } else if (error.message?.includes("minimum contribution")) {
        setError(`Minimum contribution is ${saleData.minContribution} ETH`)
      } else if (error.message?.includes("maximum contribution")) {
        setError(`Maximum contribution is ${saleData.maxContribution} ETH`)
      } else {
        setError(error.message || "Transaction failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-2xl text-primary">🪙</span>
              Impact Token Sale
            </CardTitle>
            <CardDescription className="mt-2">
              Purchase {saleData.tokenSymbol || "IMPT"} tokens to fund verified SDG projects worldwide
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <span>⏰</span>
            {getTimeRemaining()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Token Name</span>
              <span className="font-semibold">
                {isLoadingData ? "Loading..." : saleData.tokenName || "Impact Token"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Symbol</span>
              <span className="font-semibold">{isLoadingData ? "..." : saleData.tokenSymbol || "IMPT"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Price per Token</span>
              <span className="font-semibold">{saleData.tokenPrice} ETH</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Contract Address</span>
              <span className="font-mono text-xs">
                {CONTRACTS.TOKEN_ADDRESS.slice(0, 6)}...{CONTRACTS.TOKEN_ADDRESS.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">IDO Contract</span>
              <span className="font-mono text-xs">
                {CONTRACTS.IDO_ADDRESS.slice(0, 6)}...{CONTRACTS.IDO_ADDRESS.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="font-semibold">Sepolia Testnet</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Sale Progress</h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <span>📈</span>
              {progressPercentage.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Number.parseInt(saleData.tokensSold).toLocaleString()} sold</span>
            <span>{Number.parseInt(saleData.tokensLeft).toLocaleString()} remaining</span>
          </div>
        </div>

        <Separator />

        {txStatus === "pending" && (
          <Alert>
            <span className="animate-spin">⏳</span>
            <AlertDescription>
              Transaction pending...{" "}
              {txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  View on Etherscan
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        {txStatus === "success" && (
          <Alert className="border-primary/50 bg-primary/10">
            <span className="text-green-500">✅</span>
            <AlertDescription>
              Transaction successful!{" "}
              {txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  View on Etherscan
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        {txStatus === "error" && error && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <span className="text-red-500">⚠️</span>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Purchase Tokens</h3>

          {!isConnected && (
            <Alert>
              <span className="text-orange-500">⚠️</span>
              <AlertDescription>
                Please connect your wallet and switch to Sepolia testnet to participate in the token sale.
              </AlertDescription>
            </Alert>
          )}

          {isConnected && getSaleStatus() === "not_started" && (
            <Alert>
              <span>⏰</span>
              <AlertDescription>
                Token sale has not started yet. Sale begins on {saleData.saleStart.toLocaleDateString()}.
              </AlertDescription>
            </Alert>
          )}

          {isConnected && getSaleStatus() === "ended" && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <span className="text-red-500">⚠️</span>
              <AlertDescription>Token sale has ended on {saleData.saleEnd.toLocaleDateString()}.</AlertDescription>
            </Alert>
          )}

          {isConnected && getSaleStatus() === "sold_out" && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <span className="text-red-500">⚠️</span>
              <AlertDescription>All tokens have been sold out. Thank you for your interest!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eth-amount">ETH Amount</Label>
              <Input
                id="eth-amount"
                type="number"
                placeholder="0.0"
                value={ethAmount}
                onChange={(e) => handleEthAmountChange(e.target.value)}
                disabled={!isConnected || isLoading || getSaleStatus() !== "active"}
                min={saleData.minContribution}
                max={saleData.maxContribution}
                step="0.001"
              />
              <p className="text-xs text-muted-foreground">
                Min: {saleData.minContribution} ETH • Max: {saleData.maxContribution} ETH
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="token-amount">{saleData.tokenSymbol || "IMPT"} Tokens</Label>
              <Input
                id="token-amount"
                type="number"
                placeholder="0"
                value={tokenAmount}
                onChange={(e) => handleTokenAmountChange(e.target.value)}
                disabled={!isConnected || isLoading || getSaleStatus() !== "active"}
                min="0"
                step="1"
              />
              <p className="text-xs text-muted-foreground">Tokens you will receive</p>
            </div>
          </div>

          {ethAmount && tokenAmount && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <h4 className="font-medium">Transaction Summary</h4>
              <div className="flex justify-between text-sm">
                <span>ETH to spend:</span>
                <span className="font-semibold">{ethAmount} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{saleData.tokenSymbol || "IMPT"} tokens:</span>
                <span className="font-semibold">
                  {Number.parseInt(tokenAmount).toLocaleString()} {saleData.tokenSymbol || "IMPT"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span className="font-semibold">
                  1 ETH = {(1 / Number.parseFloat(saleData.tokenPrice)).toFixed(0)} {saleData.tokenSymbol || "IMPT"}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleBuyTokens}
            disabled={!isConnected || !isValidAmount() || isLoading || getSaleStatus() !== "active" || isRateLimited()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="mr-2 animate-spin">⏳</span>
                Processing Transaction...
              </>
            ) : isRateLimited() ? (
              "Please wait before next transaction"
            ) : (
              "Buy Impact Tokens"
            )}
          </Button>

          {ethAmount && !isValidAmount() && getSaleStatus() === "active" && (
            <Alert>
              <span className="text-orange-500">⚠️</span>
              <AlertDescription>
                {Number.parseFloat(ethAmount) < Number.parseFloat(saleData.minContribution) &&
                  `Minimum contribution is ${saleData.minContribution} ETH.`}
                {Number.parseFloat(ethAmount) > Number.parseFloat(saleData.maxContribution) &&
                  `Maximum contribution is ${saleData.maxContribution} ETH.`}
                {Number.parseFloat(ethAmount) / Number.parseFloat(saleData.tokenPrice) >
                  Number.parseFloat(saleData.tokensLeft) && "Not enough tokens available for this purchase amount."}
              </AlertDescription>
            </Alert>
          )}

          {isRateLimited() && (
            <Alert>
              <span>⏰</span>
              <AlertDescription>Please wait 30 seconds between transactions for security.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
