import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, base, sepolia, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Praman Certificate Verification',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, base, sepolia, baseSepolia],
  ssr: true,
});
