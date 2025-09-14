'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useBuyTokens, useIDOInfo, useTransactionStatus, calculateTokensFromETH } from '@/hooks/use-contracts'
import { useWeb3ErrorHandler } from '@/components/error-boundary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

export function TokenPurchase() {
  const { address, isConnected } = useAccount()
  const [ethAmount, setEthAmount] = useState('')
  const { handleError } = useWeb3ErrorHandler()
  
  const { data: ethBalance } = useBalance({ address })
  const { buyTokens, hash, error, isPending } = useBuyTokens()
  const { data: receipt, isLoading: isConfirming } = useTransactionStatus(hash)
  const { 
    price, 
    tokensLeft, 
    tokensSold, 
    hardCap, 
    minContribution, 
    maxContribution,
    isLoading: idoLoading,
    error: idoError 
  } = useIDOInfo()

  // Handle transaction success/failure
  useEffect(() => {
    if (receipt?.status === 'success') {
      toast.success('Tokens purchased successfully!')
      setEthAmount('')
    } else if (receipt?.status === 'reverted') {
      toast.error('Transaction failed')
    }
  }, [receipt])

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      const errorMessage = handleError(error, 'Token Purchase')
      toast.error(errorMessage)
    }
  }, [error, handleError])

  const handleBuyTokens = async () => {
    if (!ethAmount || !price) return

    try {
      await buyTokens(ethAmount)
      toast.info('Transaction submitted! Please wait for confirmation.')
    } catch (err) {
      const errorMessage = handleError(err, 'Token Purchase')
      toast.error(errorMessage)
    }
  }

  const handleMaxClick = () => {
    if (ethBalance) {
      setEthAmount(formatEther(ethBalance.value))
    }
  }

  const tokensToReceive = ethAmount && price 
    ? calculateTokensFromETH(ethAmount, price)
    : '0'

  const isAmountValid = ethAmount && 
    parseFloat(ethAmount) > 0 && 
    minContribution && 
    maxContribution &&
    parseFloat(ethAmount) >= parseFloat(formatEther(minContribution)) &&
    parseFloat(ethAmount) <= parseFloat(formatEther(maxContribution))

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
          <CardDescription>Connect your wallet to purchase Impact Tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please connect your wallet to purchase tokens
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (idoLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
          <CardDescription>Buy Impact Tokens with ETH</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-24" />
        </CardContent>
      </Card>
    )
  }

  if (idoError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tokens</CardTitle>
          <CardDescription>Buy Impact Tokens with ETH</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading IDO information
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Tokens</CardTitle>
        <CardDescription>Buy Impact Tokens with ETH</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IDO Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Price:</span>
            <div className="font-medium">
              {price ? `${formatEther(price)} ETH per token` : 'Loading...'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Tokens Left:</span>
            <div className="font-medium">
              {tokensLeft ? formatEther(tokensLeft) : 'Loading...'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Min Contribution:</span>
            <div className="font-medium">
              {minContribution ? `${formatEther(minContribution)} ETH` : 'Loading...'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Max Contribution:</span>
            <div className="font-medium">
              {maxContribution ? `${formatEther(maxContribution)} ETH` : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="space-y-2">
          <Label htmlFor="eth-amount">ETH Amount</Label>
          <div className="flex gap-2">
            <Input
              id="eth-amount"
              type="number"
              step="0.001"
              placeholder="0.0"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Button 
              variant="outline" 
              onClick={handleMaxClick}
              disabled={isPending || isConfirming}
            >
              Max
            </Button>
          </div>
        </div>

        {/* Tokens to Receive */}
        {ethAmount && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">You will receive:</div>
            <div className="text-lg font-semibold">
              {tokensToReceive} IMPACT Tokens
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {hash && (
          <Alert>
            <AlertDescription>
              Transaction submitted: {hash.slice(0, 10)}...
              {isConfirming && ' (Confirming...)'}
              {receipt && ' (Confirmed!)'}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Transaction failed: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Buy Button */}
        <Button 
          onClick={handleBuyTokens}
          disabled={!isAmountValid || isPending || isConfirming}
          className="w-full"
        >
          {isPending ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Buy Tokens'}
        </Button>

        {/* ETH Balance */}
        {ethBalance && (
          <div className="text-sm text-muted-foreground text-center">
            Balance: {formatEther(ethBalance.value)} ETH
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to format ether values
function formatEther(value: bigint): string {
  return (Number(value) / 1e18).toFixed(6)
}
