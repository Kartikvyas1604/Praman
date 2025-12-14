import { base, mainnet } from 'wagmi/chains';

export const CONTRACTS = {
  [mainnet.id]: {
    address: process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS as `0x${string}`,
    name: 'Ethereum',
  },
  [base.id]: {
    address: process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS as `0x${string}`,
    name: 'Base',
  },
};

export const SOLANA_PROGRAM_ID = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || '';

export type ChainType = 'evm' | 'solana';

export interface CertificateData {
  certificateId: string;
  recipientName: string;
  recipientAddress: string;
  courseName: string;
  issueDate: Date;
  expiryDate?: Date;
  grade?: string;
  description: string;
  issuerName: string;
}

export interface VerifiedCertificate {
  isValid: boolean;
  issuer: string;
  recipient: string;
  issueDate: number;
  expiryDate: number;
  revoked: boolean;
  metadataURI: string;
}
