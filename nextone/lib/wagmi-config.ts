import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { CONTRACTS } from './contracts'

export const config = getDefaultConfig({
  appName: 'Serragates Impact Token Sale',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

// Export the contracts for easy access
export { CONTRACTS }
