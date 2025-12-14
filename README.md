# Praman - Blockchain Certificate Verification System

> A decentralized, multi-chain certificate issuance and verification platform built on Ethereum, Base, and Solana.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![Rust](https://img.shields.io/badge/Rust-1.75-orange)](https://www.rust-lang.org/)

## 🌟 Features

- **🔗 Multi-Chain Support**: Deploy and verify certificates on Ethereum, Base, and Solana
- **🔒 Tamper-Proof**: Immutable certificate storage on blockchain
- **📱 QR Code Verification**: Instant verification via QR code scanning
- **🏢 Institutional Dashboard**: Easy certificate issuance interface
- **🌐 Decentralized**: No single point of failure
- **⚡ Real-Time Verification**: Instant credential verification (< 5 seconds)
- **💰 Cost-Effective**: Low transaction fees, especially on Base and Solana
- **📊 Comprehensive Analytics**: Track issued and received certificates

## 🏗️ Architecture

```
praman/
├── contracts/
│   ├── evm/           # Solidity contracts (Ethereum, Base)
│   └── solana/        # Rust programs (Solana)
└── frontend/          # Next.js 15 application
```

## 🚀 Quick Start

**New to the project? Start here!** → [Quick Start Guide](QUICKSTART.md)

### Prerequisites

- Node.js 18+ and npm/yarn
- Rust and Cargo (for Solana contracts)
- Solana CLI and Anchor Framework
- MetaMask or compatible Web3 wallet
- Phantom wallet (for Solana)

### 5-Minute Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up frontend
cd frontend
cp .env.example .env.local
# Edit .env.local with your configuration

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

### Full Installation

For complete setup instructions including smart contract deployment:
- 📖 [Quick Start Guide](QUICKSTART.md) - Get running in 5 minutes
- 🔧 [Development Guide](DEVELOPMENT.md) - Detailed development setup
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Production deployment

### Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SOLANA_PROGRAM_ID=...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

See [`.env.example`](frontend/.env.example) for complete configuration.

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

### � Documentation

Comprehensive documentation is available:

| Document | Description |
|----------|-------------|
| [Quick Start](QUICKSTART.md) | Get up and running in 5 minutes |
| [Development Guide](DEVELOPMENT.md) | Developer workflow, testing, best practices |
| [Deployment Guide](DEPLOYMENT.md) | Production deployment instructions |
| [API Reference](API.md) | Complete API documentation |
| [Project Summary](PROJECT_SUMMARY.md) | Comprehensive project overview |

## 🎯 How It Works

### For Institutions

### Smart Contracts
- **Solidity 0.8.24** - EVM contracts
- **Rust + Anchor 0.29.0** - Solana program
- **Hardhat** - EVM development environment
- **OpenZeppelin** - Security standards

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **wagmi + viem** - EVM Web3 integration
- **RainbowKit** - Wallet connection (EVM)
- **@solana/wallet-adapter** - Solana wallet integration

### Infrastructure
- **IPFS** - Decentralized storage (optional)
- **Vercel/Netlify** - Frontend hosting
- **Alchemy/Infura** - RPC providers

## 🧪 Testing

```bash
# EVM contracts
cd contracts/evm
npx hardhat test
npx hardhat coverage

# Solana program
cd contracts/solana
anchor test

# Frontend
cd frontend
npm run type-check
npm run lint
```

## 🔐 Security

- ✅ OpenZeppelin security standards
- ✅ Comprehensive test coverage
- ✅ Access control & role management
- ✅ Reentrancy protection
- ✅ Input validation
- ✅ Emergency pause functionality

**Security Audit**: Recommended before mainnet deployment

## 🌍 Supported Networks

### Mainnet
- **Ethereum** (Chain ID: 1)
- **Base** (Chain ID: 8453)
- **Solana** (Mainnet Beta)

### Testnet
- **Ethereum Sepolia** (Chain ID: 11155111)
- **Base Sepolia** (Chain ID: 84532)
- **Solana Devnet**

## 📊 Performance

| Metric | Value |
|--------|-------|
| Certificate Issuance | < 10 seconds |
| Verification | < 5 seconds |
| Transaction Cost (Base) | ~$0.01 |
| Transaction Cost (Solana) | ~$0.00025 |
| Frontend Load Time | < 3 seconds |

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Multi-chain smart contracts
- [x] Web application
- [x] QR code functionality
- [x] Documentation

### Phase 2 (Q1 2025)
- [ ] NFT certificates
- [ ] Batch issuance
- [ ] Mobile app
- [ ] Analytics dashboard

### Phase 3 (Q2 2025)
- [ ] DID integration
- [ ] Zero-knowledge proofs
- [ ] Cross-chain bridges
- [ ] LMS integrations

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/praman/issues)
2. 💡 Suggest features
3. 🔧 Submit pull requests
4. 📖 Improve documentation
5. ⭐ Star the project

See [DEVELOPMENT.md](DEVELOPMENT.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ for a more trustworthy credential ecosystem.

## 🙏 Acknowledgments

- OpenZeppelin for security libraries
- Anchor framework team
- Next.js team
- Ethereum and Solana communities

## 📞 Support

- 📧 Email: [Your email]
- 💬 Discord: [Your Discord]
- 🐦 Twitter: [Your Twitter]
- 📖 Docs: [Documentation link]

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ by the Praman Team**
4. **Verify** anytime, anywhere

## 📝 Smart Contract Deployment

### Quick Deploy (Testnet)

```bash
# EVM (Base Sepolia)
cd contracts/evm
npx hardhat run scripts/deploy.js --network baseSepolia

# Solana (Devnet)
cd contracts/solana
anchor deploy --provider.cluster devnet
```

### Production Deploy

See [Deployment Guide](DEPLOYMENT.md) for detailed instructions including:
- Mainnet deployment
- Contract verification
- Security considerations
- Post-deployment setup
For questions and support, please open an issue in the repository.
