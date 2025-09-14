'use client'

import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function WalletInfo() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Status</CardTitle>
          <CardDescription>Connect your wallet to view information</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">Not Connected</Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
        <CardDescription>Your connected wallet information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Address:</span>
          <Badge variant="outline" className="font-mono text-xs">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant="default">Connected</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
