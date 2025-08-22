import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, abstractTestnet, abstract } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Configure chains for your app - including Abstract chains
const chains = [mainnet, sepolia, abstractTestnet, abstract] as const

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }), // Replace with your WalletConnect project ID
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [abstractTestnet.id]: http(),
    [abstract.id]: http(),
  },
})
