# Praman - Blockchain Certificate Verification System

A decentralized, multi-chain certificate issuance and verification platform built on Ethereum, Base, and Solana.

## 🌟 Features

- **Multi-Chain Support**: Deploy and verify certificates on Ethereum, Base, and Solana
- **Tamper-Proof**: Immutable certificate storage on blockchain
- **QR Code Verification**: Instant verification via QR code scanning
- **Institutional Dashboard**: Easy certificate issuance interface
- **Decentralized**: No single point of failure
- **Real-Time Verification**: Instant credential verification

## 🏗️ Architecture

```
praman/
├── contracts/
│   ├── evm/           # Solidity contracts (Ethereum, Base)
│   └── solana/        # Rust programs (Solana)
└── frontend/          # Next.js 15 application
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Rust and Cargo (for Solana contracts)
- Solana CLI
- Anchor Framework
- MetaMask or compatible Web3 wallet
- Phantom wallet (for Solana)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up EVM contracts:**
```bash
cd contracts/evm
npm install
npx hardhat compile
```

3. **Set up Solana program:**
```bash
cd contracts/solana
anchor build
```

4. **Set up frontend:**
```bash
cd frontend
npm install
```

### Environment Setup

Create `.env.local` in the frontend directory:

```env
# RPC Endpoints
NEXT_PUBLIC_ETHEREUM_RPC_URL=
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_SOLANA_RPC_URL=

# Contract Addresses
NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS=
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=
NEXT_PUBLIC_SOLANA_PROGRAM_ID=

# Optional: IPFS for certificate data
NEXT_PUBLIC_IPFS_GATEWAY=
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📝 Smart Contract Deployment

### EVM Chains (Ethereum, Base)

```bash
cd contracts/evm
npx hardhat run scripts/deploy.js --network base
npx hardhat run scripts/deploy.js --network ethereum
```

### Solana

```bash
cd contracts/solana
anchor build
anchor deploy
```

## 🔧 Usage

### For Institutions

1. Connect wallet (MetaMask/Phantom)
2. Navigate to Institution Dashboard
3. Fill in certificate details
4. Sign transaction to issue certificate
5. Share QR code or certificate ID with recipient

### For Verification

1. Scan QR code or enter certificate ID
2. Select blockchain network
3. View certificate details and authenticity status

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity (EVM), Rust/Anchor (Solana)
- **Frontend**: Next.js 15, React 19, TypeScript
- **Web3 Integration**: wagmi, viem, RainbowKit, @solana/web3.js
- **Styling**: Tailwind CSS
- **Development**: Hardhat, Anchor Framework
- **Storage**: IPFS (optional for certificate metadata)

## 📜 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions and support, please open an issue in the repository.
