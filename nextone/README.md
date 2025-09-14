# Serragates Impact Token Sale

A modern Web3 frontend for the Impact Token Sale, built with Next.js, wagmi, and RainbowKit. This application allows users to connect their wallets and participate in the token sale supporting UN Sustainable Development Goals.

## Features

- 🔗 **Multi-wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more
- 🌐 **Chain Detection**: Automatic detection and switching to Sepolia testnet
- 💰 **Token Purchase**: Buy Impact Tokens with ETH through the IDO contract
- 📊 **Real-time Stats**: Live IDO statistics and progress tracking
- 🎨 **Modern UI**: Beautiful, responsive interface with dark/light mode
- ⚡ **Production Ready**: Error handling, loading states, and transaction confirmations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Web3**: wagmi v2, viem, RainbowKit
- **UI**: Radix UI components with Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Notifications**: Sonner toast notifications
- **TypeScript**: Full type safety

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Contract addresses
NEXT_PUBLIC_TOKEN_ADDRESS=0x49241353660f04cba0e870d4487fa168a08607ff
NEXT_PUBLIC_IDO_ADDRESS=0x0c8a3901564fe277f30e4ddd626bcd9b44f09c8f
NEXT_PUBLIC_CHAIN_ID=11155111

# RPC URLs (optional - defaults to public RPCs)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_ALCHEMY_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# WalletConnect Project ID (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Web3 providers
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── web3-providers.tsx # Web3 provider wrapper
│   ├── wallet-connection-new.tsx # Wallet connection component
│   ├── wallet-info.tsx   # Wallet information display
│   ├── token-balance.tsx # Token balance component
│   ├── token-purchase.tsx # Token purchase interface
│   ├── ido-stats.tsx     # IDO statistics
│   └── error-boundary.tsx # Error handling
├── hooks/                # Custom React hooks
│   └── use-contracts.ts  # Contract interaction hooks
├── lib/                  # Utility libraries
│   ├── contracts.ts     # Contract addresses and ABIs
│   └── wagmi-config.ts  # wagmi configuration
└── public/              # Static assets
```

## Contract Integration

### Token Contract Functions
- `balanceOf(address)` - Get token balance
- `approve(spender, amount)` - Approve token spending
- `transfer(to, amount)` - Transfer tokens

### IDO Contract Functions
- `buy()` - Purchase tokens with ETH
- `priceWeiPerToken()` - Get token price
- `tokensLeft()` - Get remaining tokens
- `tokensSold()` - Get sold tokens
- `contributions(address)` - Get user contribution

## Web3 Best Practices Implemented

1. **Provider Management**: Proper wagmi configuration with RainbowKit
2. **Error Handling**: Comprehensive error boundaries and user-friendly messages
3. **Loading States**: Skeleton loaders and loading indicators
4. **Transaction Management**: Proper transaction status tracking and confirmations
5. **Chain Detection**: Automatic network switching with user prompts
6. **Type Safety**: Full TypeScript integration with proper types
7. **Environment Variables**: Secure configuration management
8. **Responsive Design**: Mobile-first approach with responsive components

## Development

### Adding New Contract Functions

1. Add the function to the appropriate ABI in `lib/contracts.ts`
2. Create a custom hook in `hooks/use-contracts.ts`
3. Use the hook in your components

### Customizing UI

The project uses Radix UI components with Tailwind CSS. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `app/globals.css`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js.

## Security Considerations

- Contract addresses are public and safe to expose
- Never commit private keys or sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Implement proper error handling

## Support

For issues or questions:
1. Check the console for error messages
2. Ensure you're on the correct network (Sepolia)
3. Verify contract addresses are correct
4. Check wallet connection status

## License

This project is licensed under the MIT License.
