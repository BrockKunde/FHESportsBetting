# Confidential Sports Betting Platform

A privacy-preserving sports betting platform powered by Fully Homomorphic Encryption (FHE), enabling completely confidential wagering on the blockchain.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen)](https://fhe-sports-betting.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/BrockKunde/FHESportsBetting)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🌐 Links

- **Live Application**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)
- **GitHub Repository**: [https://github.com/BrockKunde/FHESportsBetting](https://github.com/BrockKunde/FHESportsBetting)
- **Contract on Etherscan**: [0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A](https://sepolia.etherscan.io/address/0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A
)

## 🔐 Core Concept: FHE Contract Confidential Sports Betting

This platform revolutionizes sports betting by implementing **Fully Homomorphic Encryption (FHE)** directly in smart contracts, creating a **hidden privacy sports prediction platform** where all sensitive data remains encrypted on-chain.

### What is FHE Contract Confidential Betting?

Traditional betting platforms expose bet amounts, user predictions, and betting patterns on the blockchain. Our platform uses **FHE smart contracts** to ensure:

- **Encrypted Predictions**: Your bet choices remain completely hidden until match settlement
- **Private Amounts**: Bet sizes are encrypted on-chain, protecting betting strategies
- **Confidential Computations**: Smart contracts calculate odds, pools, and payouts on encrypted data without ever decrypting it
- **Trustless Privacy**: No centralized party can see your betting activity, yet results are verifiable on-chain

### How FHE Transforms Sports Betting

```
Traditional Betting:          FHE Confidential Betting:
┌─────────────────┐          ┌─────────────────┐
│ Bet: Team A     │          │ Bet: [ENCRYPTED]│
│ Amount: 1 ETH   │    →     │ Amount: [ENC]   │
│ PUBLIC ❌       │          │ PRIVATE ✅      │
└─────────────────┘          └─────────────────┘
```

## 🎯 Core Concept: Hidden Privacy Sports Prediction Platform

This is a **hidden privacy sports prediction platform**  where:

### Privacy Features

1. **Encrypted Predictions**
   - All bet predictions are encrypted using FHE before submission
   - Nobody, including platform operators, can see your predictions
   - Predictions remain hidden until match completion

2. **Confidential Betting Pools**
   - Pool sizes are calculated on encrypted values
   - Individual contributions remain private
   - Only aggregate encrypted totals are visible

3. **Private Payout Calculations**
   - Winners are determined through encrypted computations
   - Payout amounts calculated on encrypted data
   - Only winners can decrypt their rewards

4. **Anonymous Participation**
   - No KYC required for betting
   - Wallet addresses are the only identifier
   - Betting patterns remain confidential

### FHE Technology Advantages

**Fully Homomorphic Encryption (FHE)** enables computations on encrypted data:

- ✅ **Complete Privacy**: Data never decrypted during processing
- ✅ **Verifiable Results**: Outcomes provable on-chain
- ✅ **Trustless System**: No trusted third party needed
- ✅ **Regulatory Friendly**: Enhanced privacy compliance
- ✅ **Fair Competition**: Hidden strategies prevent manipulation

## 🏆 Betting Types & Features

### Supported Bet Types

1. **Win/Lose/Draw** - Predict the match outcome with encrypted choices
2. **Over/Under** - Total score predictions with confidential thresholds
3. **Handicap Betting** - Encrypted handicap values for fair competition
4. **Loyalty Rewards** - Privacy-preserving rewards for active bettors

### Platform Features

- **Real-time Match Listings**: View upcoming sports events
- **Encrypted Bet Placement**: Submit predictions with full privacy
- **Confidential Pool Management**: Join betting pools anonymously
- **Automatic Payouts**: Smart contract-based distribution to winners
- **Private History**: Track your bets with encrypted records
- **Reward System**: Earn loyalty rewards without exposing betting patterns

## 📡 Smart Contract Architecture

### Deployed Contract

**Contract Address**: `0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A
`

**Network**: Ethereum Sepolia Testnet

**View on Etherscan**: [Contract Link](https://sepolia.etherscan.io/address/0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A
)

### FHE Contract Components

```solidity
// Encrypted bet structure
struct Bet {
    uint256 amount;                    // Bet amount
    BetType betType;                   // Type of bet
    euint8 encryptedPrediction;        // FHE encrypted prediction
    uint256 timestamp;                 // Bet timestamp
    uint8 flags;                       // Status flags
}

// Encrypted match betting data
struct MatchBetting {
    uint256 totalHomeBets;             // Total home team bets
    uint256 totalAwayBets;             // Total away team bets
    euint8 targetTotal;                // Encrypted target total
    euint8 handicapValue;              // Encrypted handicap
    bool scoresRevealed;               // Result status
}
```

### Key Contract Functions

- `placeBet()` - Submit encrypted bet predictions
- `finishMatch()` - Settle match with results (oracle only)
- `claimWinnings()` - Claim encrypted payouts
- `createMatch()` - Create new betting markets
- `getMatchStatus()` - View match and pool information

## 🎬 Demo & Tutorial

### Video Demonstration

**📥 Download Required**: The demo video (`demo.mp4`) must be downloaded to view as it cannot be played directly in browsers.

**[Download demo.mp4]**

The video demonstrates:
1. Connecting wallet to the platform
2. Viewing available matches and betting options
3. Placing an encrypted bet with FHE
4. Monitoring encrypted betting pools
5. Claiming winnings after match settlement
6. Complete privacy workflow from bet to payout

### Live Platform

**Experience it live**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)

Features:
- Connect MetaMask wallet
- View active sports matches
- Place confidential bets
- Monitor encrypted pools
- Claim winnings privately

## 🚀 Quick Start

This repository contains multiple implementations. Choose based on your needs:

### Implementation Comparison

| Feature | Main Implementation | sports-betting/ | fhevm-react-template/ |
|---------|-------------------|-----------------|----------------------|
| **Framework** | React + TypeScript | Vanilla JS/HTML | Multiple (React, Next.js, Vue) |
| **Complexity** | Production-ready | Simple & Educational | SDK + Examples |
| **Use Case** | Full betting platform | Learning/Demo | SDK Development |
| **Dependencies** | Full stack | Minimal | Modular SDK |
| **Best For** | Production deployment | Quick start | Framework integration |

### Prerequisites

- Node.js v18 or higher
- npm package manager
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com))

### Installation Options

#### Option 1: Main Implementation (Recommended for Production)

```bash
# Clone the repository
git clone https://github.com/BrockKunde/FHESportsBetting.git
cd FHESportsBetting

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

#### Option 2: Alternative Implementation (Quick Start)

```bash
# Navigate to sports-betting directory
cd sports-betting

# Install dependencies (minimal)
npm install

# Run locally
npm run dev
# or simply open index.html in a browser
```

#### Option 3: FHEVM SDK & Examples

```bash
# Navigate to SDK directory
cd fhevm-react-template

# Install dependencies
npm install

# Build SDK
cd packages/fhevm-sdk
npm run build

# Run examples
cd ../../examples/nextjs-showcase
npm install
npm run dev
```

### Environment Configuration

Create `.env` file:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Deployment
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Settings
REPORT_GAS=false
```

### Compile Contracts

```bash
# Compile smart contracts
npx hardhat compile
```

Compiler settings:
- Solidity: 0.8.24
- Optimizer: Enabled (200 runs)
- EVM Version: Cancun
- Via IR: Enabled

### Run Tests

```bash
# Execute test suite
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run coverage
npm run coverage
```

### Deploy Contracts

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat run scripts/verify.js --network sepolia

# Interact with contract
npx hardhat run scripts/interact.js --network sepolia

# Run full simulation
npx hardhat run scripts/simulate.js --network sepolia
```

## 🛡️ Privacy & Security Architecture

### FHE Privacy Guarantees

```
┌─────────────────────────────────────────────────┐
│           User Privacy Protection               │
├─────────────────────────────────────────────────┤
│ • Bet predictions encrypted with FHE            │
│ • Amounts hidden on-chain                       │
│ • Pool calculations on encrypted data           │
│ • Results decryptable only by winners           │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│           Smart Contract Layer                  │
├─────────────────────────────────────────────────┤
│ • Process encrypted values                      │
│ • Never decrypt sensitive data                  │
│ • Calculate payouts on encrypted pools          │
│ • Verify results without exposing bets          │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│           Blockchain Layer                      │
├─────────────────────────────────────────────────┤
│ • Store encrypted data on-chain                 │
│ • Immutable encrypted records                   │
│ • Verifiable without revealing content          │
│ • Transparent yet private                       │
└─────────────────────────────────────────────────┘
```

### Security Features

- **Non-custodial**: Users maintain full control of funds
- **Encrypted State**: All sensitive data stored encrypted
- **Access Control**: Role-based permissions for operators
- **Oracle Verification**: Decentralized result verification
- **Automated Payouts**: Trustless smart contract distribution
- **Reentrancy Protection**: Secure against common attacks

### Privacy Benefits

1. **Bet Privacy**: Predictions encrypted until settlement
2. **Amount Confidentiality**: Bet sizes remain hidden
3. **Strategy Protection**: Betting patterns not exposed
4. **Anonymous Participation**: No identity disclosure
5. **Regulatory Compliance**: Enhanced privacy standards

## 💎 Technology Stack

This repository contains multiple implementations of confidential sports betting:

### Main Implementation (Root Directory)
- **Smart Contracts**: Solidity 0.8.24 + fhEVM
- **FHE Library**: TFHE (Torus Fully Homomorphic Encryption)
- **Development**: Hardhat Framework
- **Frontend**: React, TypeScript, Ethers.js
- **Blockchain**: Ethereum Sepolia Testnet
- **Testing**: Mocha, Chai, Hardhat Test Suite
- **Deployment**: Vercel (Frontend), Ethereum (Contracts)
- **Contract**: `0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A`

### Alternative Implementation (`sports-betting/`)
- **Smart Contracts**: Solidity + fhEVM extensions
- **Encryption**: TFHE (Torus Fully Homomorphic Encryption)
- **Frontend**: HTML5, JavaScript (Vanilla), Ethers.js v5
- **Blockchain**: Zama Sepolia Testnet
- **Architecture**: Lightweight, single-page application
- **Contract**: `0xB539bf7D5960087A2742B8Fd2DceA8aE86E6E516`
- **Features**: Simplified UI, direct fhEVM integration
- **Use Case**: Educational reference, minimal dependencies

## 📊 Project Structure

```
FHESportsBetting/
├── contracts/
│   ├── ConfidentialSportsBetting.sol    # Main FHE betting contract
│   └── security/                        # Security modules
├── scripts/
│   ├── deploy.js                        # Deployment script
│   ├── verify.js                        # Contract verification
│   ├── interact.js                      # Contract interaction
│   └── simulate.js                      # Full simulation
├── test/
│   ├── ConfidentialSportsBetting.test.js   # Test suite (53 tests)
│   └── gas-benchmark.test.js            # Gas optimization tests
├── docs/
│   ├── DEPLOYMENT.md                    # Deployment guide
│   ├── TESTING.md                       # Testing documentation
│   └── SECURITY.md                      # Security guide
├── sports-betting/                      # Alternative Implementation
│   ├── app/                             # Next.js application
│   ├── contracts/                       # Smart contracts
│   ├── scripts/                         # Deployment scripts
│   ├── public/                          # Static assets
│   ├── index.html                       # Main HTML entry
│   ├── styles.css                       # Styling
│   ├── hardhat.config.js                # Hardhat config
│   └── README.md                        # Implementation docs
├── fhevm-react-template/                # FHEVM SDK & Examples
│   ├── packages/fhevm-sdk/              # Universal FHEVM SDK
│   ├── examples/                        # Framework examples
│   ├── templates/                       # Template references
│   └── docs/                            # SDK documentation
├── hardhat.config.js                    # Hardhat configuration
├── package.json                         # Dependencies
└── demo.mp4                             # Video demonstration
```

## 🔧 Available Scripts

### Main Implementation

| Script | Command | Description |
|--------|---------|-------------|
| Compile | `npm run compile` | Compile smart contracts |
| Test | `npm test` | Run test suite (53 tests) |
| Deploy | `npm run deploy` | Deploy to Sepolia |
| Verify | `npm run verify` | Verify on Etherscan |
| Simulate | `npm run simulate` | Run betting simulation |
| Coverage | `npm run coverage` | Generate test coverage |
| Lint | `npm run lint` | Check code quality |

### sports-betting/ Implementation

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm run dev` or open `index.html` | Run local development server |
| Install | `npm install` | Install dependencies (ethers.js) |

### fhevm-react-template/ Implementation

| Script | Command | Description |
|--------|---------|-------------|
| Build SDK | `cd packages/fhevm-sdk && npm run build` | Build FHEVM SDK |
| Next.js Example | `cd examples/nextjs-showcase && npm run dev` | Run Next.js example |
| React Example | `cd examples/react-example && npm run dev` | Run React + Vite example |
| Sports Betting | `cd examples/sports-betting && npm run dev` | Run betting example |

## 🌟 Use Cases

### Individual Bettors
- **Private Wagering**: Bet without revealing strategies
- **Anonymous Participation**: No identity exposure
- **Protected Balances**: Encrypted account tracking
- **Confidential History**: Private betting records

### Professional Bettors
- **Strategy Protection**: Hide betting patterns
- **Large Bets**: Privacy for high-value wagers
- **Performance Tracking**: Encrypted statistics
- **Institutional Privacy**: Corporate betting confidentiality

### Platform Operators
- **Compliance**: Enhanced privacy regulations
- **User Trust**: Guaranteed confidentiality
- **Fair Markets**: Prevent bet manipulation
- **Transparent Operations**: Verifiable yet private

## 🎯 Which Implementation Should You Use?

### Use Main Implementation If:
- ✅ Building a production betting platform
- ✅ Need full-featured React + TypeScript application
- ✅ Want comprehensive testing and security
- ✅ Require advanced betting features and analytics
- ✅ Planning to scale and customize extensively

### Use sports-betting/ If:
- ✅ Learning FHE and fhEVM concepts
- ✅ Need a quick demo or prototype
- ✅ Prefer minimal dependencies
- ✅ Want simple, understandable code
- ✅ Building educational content or tutorials

### Use fhevm-react-template/ If:
- ✅ Developing your own FHE dApp
- ✅ Need a reusable SDK for FHE operations
- ✅ Working with multiple frameworks (React, Next.js, Vue)
- ✅ Want modular, framework-agnostic code
- ✅ Building SDK integrations

## 🌟 Key Differences

### Main Implementation
- **Live Demo**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)
- **Contract**: `0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A` (Ethereum Sepolia)
- **Features**: Complete betting platform with advanced features
- **Tech**: React, TypeScript, Hardhat, comprehensive testing

### sports-betting/ Directory
- **Live Demo**: [https://confidential-sports-betting.vercel.app/](https://confidential-sports-betting.vercel.app/)
- **Contract**: `0xB539bf7D5960087A2742B8Fd2DceA8aE86E6E516` (Zama Sepolia)
- **Features**: Simplified betting with core FHE functionality
- **Tech**: Vanilla JavaScript, HTML5, minimal dependencies

### fhevm-react-template/ Directory
- **Purpose**: Universal FHEVM SDK and framework examples
- **Structure**: Modular SDK with multiple example implementations
- **Features**: Framework-agnostic core, React hooks, templates
- **Tech**: TypeScript, React, Next.js, Vue support

## 📈 Future Roadmap

- [ ] Multi-sport expansion (Football, Basketball, Baseball)
- [ ] Live in-game betting with real-time FHE
- [ ] Peer-to-peer encrypted betting markets
- [ ] Advanced bet types (Parlays, Teasers, Props)
- [ ] Mobile application (iOS/Android)
- [ ] Cross-chain FHE bridges
- [ ] Decentralized oracle network
- [ ] Layer 2 scaling solutions
- [ ] Unified SDK across all implementations

## 🤝 Contributing

Contributions are welcome! This is an open-source privacy project.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

This is an open-source privacy-focused project.

## ⚠️ Disclaimer

This platform is deployed on Ethereum Sepolia testnet for demonstration and testing purposes. No real money is involved. Always bet responsibly and comply with local gambling regulations.

## 📞 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/BrockKunde/FHESportsBetting/issues)
- **Documentation**: See [docs/](./docs/) folder
- **Live Demo**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)

## 🏅 Acknowledgments

Built with:
- **fhEVM**: Fully Homomorphic Encryption for Ethereum
- **TFHE**: Torus Fully Homomorphic Encryption library
- **Hardhat**: Ethereum development environment
- **Ethers.js**: Ethereum library for Web3
- **Zama**: FHE technology provider

---

## 🎯 Key Highlights

✅ **First FHE-based sports betting platform**
✅ **Complete on-chain privacy with smart contracts**
✅ **Hidden predictions until match settlement**
✅ **Trustless and verifiable results**
✅ **Open-source and auditable code**

---

## 📚 Quick Reference Guide

### Three Implementations, One Vision

This repository showcases confidential sports betting through three complementary approaches:

1. **Main Implementation** (Root) - Production-grade platform
   - 🌐 Live: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)
   - 📜 Contract: `0x1846d67Dcf544B374D59F6d9a9adE4e37719D57A`
   - 🔧 Tech: React, TypeScript, Hardhat
   - 🎯 Best for: Production deployment

2. **sports-betting/** - Lightweight alternative
   - 🌐 Live: [https://confidential-sports-betting.vercel.app/](https://confidential-sports-betting.vercel.app/)
   - 📜 Contract: `0xB539bf7D5960087A2742B8Fd2DceA8aE86E6E516`
   - 🔧 Tech: Vanilla JavaScript, HTML5
   - 🎯 Best for: Learning and quick demos

3. **fhevm-react-template/** - Universal SDK
   - 📦 Package: `@fhevm/sdk`
   - 🔧 Tech: Framework-agnostic SDK with examples
   - 🎯 Best for: Building custom FHE dApps

### Choose Your Path

```bash
# Quick start with main implementation
git clone https://github.com/BrockKunde/FHESportsBetting.git
cd FHESportsBetting && npm install && npm test

# Or explore the lightweight version
cd sports-betting && open index.html

# Or build with the SDK
cd fhevm-react-template && cd packages/fhevm-sdk && npm run build
```

---

**Built with Privacy. Powered by FHE. Secured by Blockchain.**

**Experience the future of confidential sports betting**:
- Main Platform: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)
- Alternative: [https://confidential-sports-betting.vercel.app/](https://confidential-sports-betting.vercel.app/)

**Source Code**: [https://github.com/BrockKunde/FHESportsBetting](https://github.com/BrockKunde/FHESportsBetting)
