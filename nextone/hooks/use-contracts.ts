import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, TOKEN_ABI, IDO_ABI } from '@/lib/contracts'
import { parseEther, formatEther } from 'viem'
import { useAccount } from 'wagmi'

// Token Contract Hooks
export function useTokenBalance(address?: `0x${string}`) {
  const { address: accountAddress } = useAccount()
  const targetAddress = address || accountAddress

  return useReadContract({
    address: CONTRACTS.TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  })
}

export function useTokenAllowance(spender?: `0x${string}`) {
  const { address } = useAccount()

  return useReadContract({
    address: CONTRACTS.TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender] : undefined,
    query: {
      enabled: !!address && !!spender,
    },
  })
}

export function useApproveToken() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const approve = async (spender: `0x${string}`, amount: string) => {
    writeContract({
      address: CONTRACTS.TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)],
    })
  }

  return {
    approve,
    hash,
    error,
    isPending,
  }
}

export function useTransferToken() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const transfer = async (to: `0x${string}`, amount: string) => {
    writeContract({
      address: CONTRACTS.TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'transfer',
      args: [to, parseEther(amount)],
    })
  }

  return {
    transfer,
    hash,
    error,
    isPending,
  }
}

// IDO Contract Hooks
export function useIDOInfo() {
  const priceQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'priceWeiPerToken',
  })

  const tokensLeftQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'tokensLeft',
  })

  const tokensSoldQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'tokensSold',
  })

  const hardCapQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'hardCapTokens',
  })

  const minContributionQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'minContribution',
  })

  const maxContributionQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'maxContribution',
  })

  const startTimeQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'start',
  })

  const endTimeQuery = useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'end',
  })

  return {
    price: priceQuery.data,
    tokensLeft: tokensLeftQuery.data,
    tokensSold: tokensSoldQuery.data,
    hardCap: hardCapQuery.data,
    minContribution: minContributionQuery.data,
    maxContribution: maxContributionQuery.data,
    startTime: startTimeQuery.data,
    endTime: endTimeQuery.data,
    isLoading: priceQuery.isLoading || tokensLeftQuery.isLoading || tokensSoldQuery.isLoading,
    error: priceQuery.error || tokensLeftQuery.error || tokensSoldQuery.error,
  }
}

export function useBuyTokens() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const buyTokens = async (ethAmount: string) => {
    writeContract({
      address: CONTRACTS.IDO_ADDRESS,
      abi: IDO_ABI,
      functionName: 'buy',
      value: parseEther(ethAmount),
    })
  }

  return {
    buyTokens,
    hash,
    error,
    isPending,
  }
}

export function useUserContribution() {
  const { address } = useAccount()

  return useReadContract({
    address: CONTRACTS.IDO_ADDRESS,
    abi: IDO_ABI,
    functionName: 'contributions',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

// Utility hooks
export function useTransactionStatus(hash?: `0x${string}`) {
  return useWaitForTransactionReceipt({
    hash,
  })
}

// Helper functions
export function formatTokenAmount(amount: bigint | undefined, decimals: number = 18): string {
  if (!amount) return '0'
  return formatEther(amount)
}

export function calculateTokensFromETH(ethAmount: string, pricePerToken: bigint): string {
  try {
    const ethInWei = parseEther(ethAmount)
    const tokens = (ethInWei * BigInt(10 ** 18)) / pricePerToken
    return formatEther(tokens)
  } catch {
    return '0'
  }
}
