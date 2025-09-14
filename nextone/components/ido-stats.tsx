'use client'

import { useIDOInfo } from '@/hooks/use-contracts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatEther } from 'viem'

export function IDOStats() {
  const { 
    tokensLeft, 
    tokensSold, 
    hardCap, 
    price,
    minContribution,
    maxContribution,
    isLoading, 
    error 
  } = useIDOInfo()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>IDO Statistics</CardTitle>
          <CardDescription>Current sale progress and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-24" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>IDO Statistics</CardTitle>
          <CardDescription>Current sale progress and information</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="destructive">Error loading IDO data</Badge>
        </CardContent>
      </Card>
    )
  }

  const totalTokens = tokensSold && tokensLeft ? tokensSold + tokensLeft : hardCap
  const progressPercentage = totalTokens && tokensSold 
    ? (Number(tokensSold) / Number(totalTokens)) * 100 
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>IDO Statistics</CardTitle>
        <CardDescription>Current sale progress and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">
              {tokensSold ? formatEther(tokensSold) : '0'}
            </div>
            <div className="text-sm text-muted-foreground">Tokens Sold</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">
              {tokensLeft ? formatEther(tokensLeft) : '0'}
            </div>
            <div className="text-sm text-muted-foreground">Tokens Left</div>
          </div>
        </div>

        {/* Price and Limits */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price per Token:</span>
            <span className="font-medium">
              {price ? `${formatEther(price)} ETH` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Min Contribution:</span>
            <span className="font-medium">
              {minContribution ? `${formatEther(minContribution)} ETH` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Contribution:</span>
            <span className="font-medium">
              {maxContribution ? `${formatEther(maxContribution)} ETH` : 'Loading...'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
