# Confidential Sports Betting Platform

A privacy-first sports betting platform built with Fully Homomorphic Encryption (FHE) technology, enabling completely confidential wagering on the blockchain.

## 🔐 Core Concept

This platform leverages **Fully Homomorphic Encryption (FHE)** to create a trustless, privacy-preserving sports betting experience. Unlike traditional betting platforms, all bet amounts, predictions, and user data remain encrypted on-chain, ensuring complete confidentiality while maintaining the transparency and security of blockchain technology.

### Key Features

- **Private Betting**: All wagers and predictions are encrypted using FHE, protecting user privacy
- **Confidential Odds**: Betting odds and pool sizes remain encrypted until match settlement
- **Secure Rewards**: Automated reward distribution through encrypted smart contracts
- **Zero-Knowledge Verification**: Verify wins without revealing bet details
- **On-Chain Privacy**: Complete transaction privacy while maintaining blockchain immutability

## 🎯 How It Works

1. **Match Creation**: Operators create encrypted betting markets for upcoming sports events
2. **Place Bets**: Users submit encrypted bets on match outcomes (win/lose, over/under, handicap)
3. **Encrypted Processing**: All calculations happen on encrypted data without decryption
4. **Match Settlement**: Oracle submits results, contracts calculate payouts on encrypted values
5. **Claim Winnings**: Winners receive payouts automatically with full privacy protection

## 🏆 Supported Bet Types

- **Win/Lose/Draw**: Predict the match outcome
- **Over/Under**: Total goals/points threshold betting
- **Handicap Betting**: Encrypted handicap wagering
- **Loyalty Rewards**: Privacy-preserving reward system for active bettors

## 📡 Smart Contract

**Contract Address**: `0xB539bf7D5960087A2742B8Fd2DceA8aE86E6E516`

**Network**: Ethereum Sepolia Testnet

The smart contract implements FHE operations using the fhEVM framework, enabling:
- Encrypted bet storage and processing
- Private odds calculations
- Confidential pool management
- Secure payout distribution

**View on Etherscan**: [https://sepolia.etherscan.io/address/0xB539bf7D5960087A2742B8Fd2DceA8aE86E6E516](https://sepolia.etherscan.io/address/0xB539bf7D5960087A2742B8Fd2DceA8aE86E6E516)

## 🚀 Development & Deployment

### Prerequisites

- Node.js v18+ and npm
- Hardhat development environment
- Ethereum wallet with testnet ETH

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Configuration

Create a `.env` file with the following variables:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=false
```

### Compilation

```bash
# Compile smart contracts
npx hardhat compile
```

Compiler Configuration:
- Solidity version: 0.8.24
- Optimizer enabled (200 runs)
- EVM version: Cancun
- Via IR compilation for better optimization

### Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Start local Hardhat node
npx hardhat node

# Run simulation on local network
npx hardhat run scripts/simulate.js --network localhost
```

### Deployment

#### Deploy to Sepolia Testnet

```bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat run scripts/verify.js --network sepolia

# Interact with deployed contract
npx hardhat run scripts/interact.js --network sepolia
```

#### Deploy to Mainnet

**WARNING: This uses real ETH!**

```bash
npx hardhat run scripts/deploy.js --network mainnet
npx hardhat run scripts/verify.js --network mainnet
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `scripts/deploy.js` | Complete deployment with gas estimation and verification |
| `scripts/verify.js` | Verify contracts on Etherscan |
| `scripts/interact.js` | View contract info and call functions |
| `scripts/simulate.js` | Run full betting scenario simulation |

### Deployment Information

Deployed contracts are saved in `deployments/`:
- `{network}-latest.json` - Latest deployment data
- `{network}-{timestamp}.json` - Historical deployments
- `{network}-verification.json` - Verification status

Example deployment output:
```bash
==================================================
Confidential Sports Betting Platform - Deployment
==================================================

Deployer address: 0x...
Network: sepolia
Chain ID: 11155111

Deploying Contracts...
✅ ConfidentialSportsBetting deployed to: 0x...

Deployment Summary
Network: sepolia
ConfidentialSportsBetting: 0x...
Etherscan: https://sepolia.etherscan.io/address/0x...
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 📡 Network Information

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com

### Ethereum Mainnet
- **Chain ID**: 1
- **RPC URL**: https://mainnet.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer**: https://etherscan.io

## 🎬 Demo

**Live Demo**: [https://confidential-sports-betting.vercel.app/](https://confidential-sports-betting.vercel.app/)

### Video Demonstration

[Watch Demo Video](ConfidentialSportsBetting.mp4) - See the platform in action with live betting scenarios

### On-Chain Transactions

All transactions are verifiable on the Sepolia Testnet block explorer while maintaining user privacy through FHE encryption.

Example Transactions:
- Encrypted bet placement
- Match creation with encrypted parameters
- Confidential reward distribution
- Privacy-preserving payout claims

## 🛡️ Privacy Architecture

### FHE Implementation

The platform uses **fhEVM** (Fully Homomorphic Encryption for EVM) to enable:

```
User Bet (Plaintext) → Encryption → FHE Contract (Encrypted) → Processing → Results (Encrypted) → Decryption (Winner Only) → Payout
```

### Privacy Guarantees

- **Bet Amounts**: Encrypted on-chain, only known to the bettor
- **Predictions**: Completely confidential until match settlement
- **Pool Sizes**: Aggregated in encrypted form
- **User Balances**: Private account tracking
- **Win/Loss Records**: Encrypted historical data

## 💎 Technology Stack

- **Smart Contracts**: Solidity 0.8.24 with fhEVM extensions
- **Development Framework**: Hardhat
- **Encryption**: TFHE (Torus Fully Homomorphic Encryption)
- **Frontend**: HTML5, JavaScript, Ethers.js
- **Blockchain**: Ethereum Sepolia Testnet
- **Oracle**: Decentralized sports data feeds
- **Testing**: Hardhat Test Suite with Mocha/Chai

## 🌐 Live Application

**Website**: [https://confidential-sports-betting.vercel.app/](https://confidential-sports-betting.vercel.app/)

**Repository**: [https://github.com/BrockKunde/ConfidentialSportsBetting](https://github.com/BrockKunde/ConfidentialSportsBetting)

## 🔧 Features Overview

### For Bettors
- Connect wallet and place encrypted bets
- View active matches and betting options
- Track personal betting history (encrypted)
- Claim winnings with privacy protection
- Earn loyalty rewards

### For Operators
- Create encrypted betting markets
- Set confidential odds and limits
- Submit match results via oracle
- Manage platform parameters

### Privacy Dashboard
- Encrypted bet tracking
- Confidential statistics
- Private reward tiers
- Anonymous leaderboards

## 🎮 User Interface

The platform features an intuitive interface with:
- Real-time match listings
- Multiple bet type options
- Encrypted balance display
- Privacy-preserving transaction history
- Responsive design for all devices

## 🔒 Security Features

- **Non-custodial**: Users maintain full control of funds
- **Encrypted State**: All sensitive data stored in encrypted form
- **Verifiable Results**: Match outcomes verified on-chain
- **Automated Payouts**: Smart contract-based distribution
- **Access Control**: Role-based permissions for operators

## 📊 Statistics & Analytics

Users can view their betting performance through encrypted analytics:
- Total bets placed (encrypted count)
- Win rate (privacy-preserving calculation)
- Reward tier status
- Historical performance trends

All statistics are calculated on encrypted data, ensuring complete privacy.

## 🌟 Use Cases

1. **Private Sports Wagering**: Bet on your favorite teams without revealing strategies
2. **Confidential Pool Betting**: Join pools without exposing bet sizes
3. **Anonymous High-Roller Betting**: Large wagers with complete privacy
4. **Privacy-First Fantasy Sports**: Encrypted fantasy league betting
5. **Institutional Betting**: Corporate betting with confidentiality

## 🔮 Future Enhancements

- Multi-sport expansion
- Live in-game betting with FHE
- Peer-to-peer encrypted betting markets
- Advanced bet types (parlays, teasers)
- Mobile application
- Cross-chain privacy bridges

## 📜 License

MIT License - Open source and privacy-focused

## 🤝 Contributing

This is an open-source privacy project. Contributions are welcome to enhance the platform's privacy features and user experience.

## ⚠️ Disclaimer

This platform is for demonstration purposes on testnet. Always bet responsibly and comply with local gambling regulations.

---

**Built with Privacy. Powered by FHE. Secured by Blockchain.**

*Experience the future of confidential sports betting at [https://confidential-sports-betting.vercel.app/](https://confidential-sports-betting.vercel.app/)*
