"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Transaction {
  hash: string
  status: "pending" | "success" | "failed"
  timestamp: Date
  ethAmount: string
  tokenAmount: string
  blockNumber?: number
}

interface TransactionStatusProps {
  transactions: Transaction[]
  onClearTransactions: () => void
}

export function TransactionStatus({ transactions, onClearTransactions }: TransactionStatusProps) {
  const [copiedHash, setCopiedHash] = useState<string>("")

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHash(text)
      setTimeout(() => setCopiedHash(""), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-500">⏳</span>
      case "success":
        return <span className="text-green-500">✅</span>
      case "failed":
        return <span className="text-red-500">❌</span>
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">
            Pending
          </Badge>
        )
      case "success":
        return (
          <Badge variant="secondary" className="text-green-600 bg-green-50">
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="text-red-600 bg-red-50">
            Failed
          </Badge>
        )
    }
  }

  if (transactions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm" onClick={onClearTransactions}>
            Clear History
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.slice(0, 5).map((tx, index) => (
          <div key={tx.hash} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getStatusIcon(tx.status)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Token Purchase</span>
                    {getStatusBadge(tx.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.ethAmount} ETH → {tx.tokenAmount} IMPT
                  </div>
                  <div className="text-xs text-muted-foreground">{tx.timestamp.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Hash:</span>
              <code className="font-mono bg-muted px-1 py-0.5 rounded">
                {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
              </code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(tx.hash)}>
                <span className="text-xs">{copiedHash === tx.hash ? "✅" : "📋"}</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                  <span className="text-xs">🔗</span>
                </a>
              </Button>
            </div>

            {index < transactions.length - 1 && <Separator />}
          </div>
        ))}

        {transactions.length > 5 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing 5 of {transactions.length} transactions
          </div>
        )}
      </CardContent>
    </Card>
  )
}
