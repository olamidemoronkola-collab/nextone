'use client'

import { useTokenBalance, formatTokenAmount } from '@/hooks/use-contracts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function TokenBalance() {
  const { data: balance, isLoading, error } = useTokenBalance()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Balance</CardTitle>
          <CardDescription>Your Impact Token balance</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Balance</CardTitle>
          <CardDescription>Your Impact Token balance</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="destructive">Error loading balance</Badge>
        </CardContent>
      </Card>
    )
  }

  const formattedBalance = formatTokenAmount(balance)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Balance</CardTitle>
        <CardDescription>Your Impact Token balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formattedBalance}</span>
          <Badge variant="outline">IMPACT</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
