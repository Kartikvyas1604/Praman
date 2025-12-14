import { create } from 'zustand';

interface AppState {
  selectedChain: 'ethereum' | 'base' | 'solana';
  setSelectedChain: (chain: 'ethereum' | 'base' | 'solana') => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedChain: 'base',
  setSelectedChain: (chain) => set({ selectedChain: chain }),
}));
