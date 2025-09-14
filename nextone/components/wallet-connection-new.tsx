'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSwitchChain } from 'wagmi'

export function WalletConnection() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isCorrectChain = chainId === CONTRACTS.CHAIN_ID

  const handleSwitchChain = () => {
    switchChain({ chainId: CONTRACTS.CHAIN_ID })
  }

  if (!isConnected) {
    return (
      <div className="space-y-3 px-4 sm:px-0">
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <Badge variant={isCorrectChain ? "default" : "destructive"} className="flex items-center gap-1">
          <span>{isCorrectChain ? "✅" : "❌"}</span>
          {isCorrectChain ? "Sepolia" : "Wrong Network"}
        </Badge>
        <Badge variant="outline" className="font-mono text-xs">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Badge>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {!isCorrectChain && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSwitchChain} 
            className="w-full sm:w-auto bg-transparent"
          >
            Switch Network
          </Button>
        )}
        <ConnectButton />
      </div>
    </div>
  )
}
