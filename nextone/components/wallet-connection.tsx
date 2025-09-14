"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean) => void
  onAccountChange: (account: string) => void
  onNetworkChange: (isCorrect: boolean) => void
}

const SEPOLIA_CHAIN_ID = "0xaa36a7" // 11155111 in hex

export function WalletConnection({ onConnectionChange, onAccountChange, onNetworkChange }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>("")
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>("")

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum?.isMetaMask
  }

  // Check current network
  const checkNetwork = async () => {
    if (!window.ethereum) return false

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const isCorrect = chainId === SEPOLIA_CHAIN_ID
      setIsCorrectNetwork(isCorrect)
      onNetworkChange(isCorrect)
      return isCorrect
    } catch (error) {
      console.error("Error checking network:", error)
      return false
    }
  }

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "SEP",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError)
          setError("Failed to add Sepolia network")
        }
      } else {
        console.error("Error switching to Sepolia:", switchError)
        setError("Failed to switch to Sepolia network")
      }
    }
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAccount(account)
        setIsConnected(true)
        onConnectionChange(true)
        onAccountChange(account)

        // Check and switch network if needed
        const networkCorrect = await checkNetwork()
        if (!networkCorrect) {
          await switchToSepolia()
          await checkNetwork()
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect wallet")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount("")
    setIsConnected(false)
    setIsCorrectNetwork(false)
    onConnectionChange(false)
    onAccountChange("")
    onNetworkChange(false)
  }

  // Listen for account and network changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAccount(accounts[0])
        onAccountChange(accounts[0])
      }
    }

    const handleChainChanged = () => {
      checkNetwork()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Check if already connected
    window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        onConnectionChange(true)
        onAccountChange(accounts[0])
        checkNetwork()
      }
    })

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  if (!isMetaMaskInstalled()) {
    return (
      <Alert className="mx-4 sm:mx-0 sm:max-w-sm">
        <span className="text-orange-500">⚠️</span>
        <AlertDescription>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Install MetaMask
          </a>{" "}
          to connect your wallet
        </AlertDescription>
      </Alert>
    )
  }

  if (!isConnected) {
    return (
      <div className="space-y-3 px-4 sm:px-0">
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
        {error && (
          <Alert className="sm:max-w-sm">
            <span className="text-red-500">⚠️</span>
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <Badge variant={isCorrectNetwork ? "default" : "destructive"} className="flex items-center gap-1">
          <span>{isCorrectNetwork ? "✅" : "❌"}</span>
          {isCorrectNetwork ? "Sepolia" : "Wrong Network"}
        </Badge>
        <Badge variant="outline" className="font-mono text-xs">
          {account.slice(0, 6)}...{account.slice(-4)}
        </Badge>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {!isCorrectNetwork && (
          <Button size="sm" variant="outline" onClick={switchToSepolia} className="w-full sm:w-auto bg-transparent">
            Switch Network
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={disconnectWallet} className="w-full sm:w-auto bg-transparent">
          Disconnect
        </Button>
      </div>
    </div>
  )
}
