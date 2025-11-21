# FHEVM React Template

Universal SDK and framework integrations for building confidential dApps with Fully Homomorphic Encryption (FHE).

[![FHEVM Banner](https://img.shields.io/badge/FHEVM-SDK-blue?style=for-the-badge)](https://github.com/BrockKunde/fhevm-react-template)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge)](https://www.typescriptlang.org/)

## 🌐 Links

- **GitHub Repository**: [https://github.com/BrockKunde/fhevm-react-template](https://github.com/BrockKunde/fhevm-react-template)
- **Live Example**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)
- **Sports Betting Demo**: See our confidential sports betting platform in action

## Overview

This project provides a complete toolkit for building confidential decentralized applications using FHEVM technology. It includes:

- **Universal SDK**: Framework-agnostic core with wagmi-like API
- **React Hooks**: Ready-to-use hooks for React applications
- **Example dApps**: Production-ready examples including sports betting and showcases
- **Comprehensive Documentation**: Complete guides and API reference

## Key Features

- **Easy Integration**: Get started in less than 10 lines of code
- **Framework Agnostic**: Works with React, Next.js, Vue, vanilla JavaScript, and Node.js
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Modular Design**: Use only what you need
- **Production Ready**: Battle-tested patterns and best practices
- **Zero Config**: Sensible defaults for quick setup

## Quick Start

### Installation

```bash
npm install @fhevm/sdk ethers
```

### Basic Usage

```typescript
import { createFhevmClient, initFhevm, encryptInput } from '@fhevm/sdk';
import { ethers } from 'ethers';

// 1. Create client
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const client = createFhevmClient({ provider, signer });

// 2. Initialize FHEVM
await initFhevm(client);

// 3. Encrypt input
const encrypted = await encryptInput({
  values: [{ value: 100, type: 'euint32' }],
  contractAddress: '0x...',
  userAddress: await signer.getAddress(),
});

// 4. Use in contract call
await contract.myFunction(encrypted.handles[0], encrypted.inputProof);
```

### React Example

```tsx
import { useFhevmClient, useEncryptInput } from '@fhevm/sdk/react';

function MyComponent() {
  const { isInitialized } = useFhevmClient({ provider, signer });
  const { encrypt, isEncrypting } = useEncryptInput();

  const handleEncrypt = async () => {
    const result = await encrypt({
      values: [{ value: 42, type: 'euint32' }],
      contractAddress: '0x...',
      userAddress: address,
    });
  };

  return isInitialized ? <button onClick={handleEncrypt}>Encrypt</button> : <p>Loading...</p>;
}
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Universal FHEVM SDK
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── react/          # React hooks
│       │   ├── types.ts        # TypeScript definitions
│       │   └── utils/          # Utility functions
│       └── README.md
├── examples/                   # Working example implementations
│   ├── nextjs-showcase/        # Complete Next.js demo with SDK integration
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   │   ├── api/        # API routes (FHE operations, keys)
│   │   │   │   ├── layout.tsx  # Root layout
│   │   │   │   ├── page.tsx    # Home page
│   │   │   │   └── globals.css # Global styles
│   │   │   ├── components/     # React components
│   │   │   │   ├── ui/         # UI components (Button, Input, Card)
│   │   │   │   ├── fhe/        # FHE components (Provider, Demos, KeyManager)
│   │   │   │   └── examples/   # Use case examples (Banking, Medical)
│   │   │   ├── lib/            # Libraries
│   │   │   │   ├── fhe/        # FHE integration (client, server, keys, types)
│   │   │   │   └── utils/      # Utilities (security, validation)
│   │   │   ├── hooks/          # Custom hooks (useFHE, useEncryption, useComputation)
│   │   │   └── types/          # TypeScript types
│   │   └── README.md
│   ├── react-example/          # React + Vite example with TypeScript
│   │   ├── src/
│   │   │   ├── components/     # React components (WalletConnect, Encryption, Decryption)
│   │   │   ├── App.tsx         # Main application
│   │   │   └── main.tsx        # Entry point
│   │   └── README.md
│   ├── sports-betting/         # Confidential sports betting platform
│   └── vanilla-js/             # Pure JavaScript example
├── templates/                  # Template references for different frameworks
│   ├── nextjs/                 # Next.js template reference
│   ├── react/                  # React template reference
│   ├── vue/                    # Vue.js template reference
│   └── nodejs/                 # Node.js template reference
├── docs/
│   ├── getting-started.md      # Getting started guide
│   ├── api-reference.md        # Complete API documentation
│   └── deployment-guide.md     # Deployment best practices
└── demo.mp4                    # Video demonstration
```

## Examples

### Next.js Showcase

Interactive demonstration of FHEVM SDK features with complete integration:
- **Wallet Connection**: MetaMask integration with network detection
- **FHEVM Status**: Real-time initialization tracking and error handling
- **Encryption Demo**: Interactive encryption with all supported types (euint8-euint128, ebool, eaddress)
- **Computation Demo**: Homomorphic operations on encrypted data (add, sub, mul, comparison)
- **Key Management**: Public key fetching and display
- **Use Case Examples**: Banking and Medical record examples
- **API Routes**: Complete Next.js API implementation for FHE operations
- **Component Library**: Reusable UI components (Button, Input, Card)
- **Custom Hooks**: React hooks for FHE operations
- **Type Safety**: Full TypeScript support with comprehensive types

**Structure follows the complete architecture from next.md:**
- App Router with layouts and pages
- API routes for FHE, encryption, decryption, computation, and key management
- UI components and FHE-specific components
- Utility libraries for client/server operations
- Custom hooks and type definitions

[View Example](./examples/nextjs-showcase/) | [View Structure Details](./examples/nextjs-showcase/README.md)

### React Example

Modern React application with Vite and TypeScript:
- **Component-Based Architecture**: Modular, reusable components
- **Wallet Integration**: MetaMask connection with state management
- **Real-Time Status**: Live initialization and operation feedback
- **Type Safety**: Full TypeScript support throughout
- **Fast Development**: Vite for instant HMR and optimized builds
- **Encryption/Decryption**: Interactive demos with all encrypted types

**Built with modern React best practices:**
- Functional components with hooks
- TypeScript for type safety
- Vite for fast development
- Clean component architecture
- Responsive UI design

[View Example](./examples/react-example/) | [View Documentation](./examples/react-example/README.md)

### Confidential Sports Betting

Full-featured betting platform with encrypted predictions:
- Fully confidential bet placement
- Multiple bet types (Win/Lose, Over/Under, Handicap)
- Pool-based payout system
- Oracle-based match settlement

[View Example](./examples/sports-betting/) | **[Live Demo](https://fhe-sports-betting.vercel.app/)** ⚡

### Vanilla JavaScript

Pure JavaScript implementation without frameworks:
- No build tools required
- Complete encryption/decryption workflow
- Interactive UI with live examples
- Educational code structure

[View Example](./examples/vanilla-js/)

## Documentation

- **[Getting Started](./docs/getting-started.md)** - Installation and basic usage
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Deployment Guide](./docs/deployment-guide.md)** - Production deployment guide
- **[Next.js Example](./examples/nextjs-showcase/README.md)** - Complete Next.js integration guide

## Features in Detail

### Universal SDK (`@fhevm/sdk`)

Framework-agnostic core that works everywhere:

```typescript
// Works in browser
import { createFhevmClient } from '@fhevm/sdk';

// Works in Node.js
const { createFhevmClient } = require('@fhevm/sdk');

// Works with any framework
// React, Vue, Angular, Svelte, etc.
```

### React Hooks (`@fhevm/sdk/react`)

Intuitive hooks following React best practices:

- `useFhevmClient()` - Initialize FHEVM with automatic state management
- `useEncryptInput()` - Encrypt values with loading states
- `useDecryptOutput()` - Decrypt values with permission handling
- `useFhevmContract()` - Create contract instances with FHEVM context

### Encrypted Types Support

Full support for all FHEVM encrypted types:

| Type | Description | Range |
|------|-------------|-------|
| `euint8` | 8-bit unsigned integer | 0-255 |
| `euint16` | 16-bit unsigned integer | 0-65,535 |
| `euint32` | 32-bit unsigned integer | 0-4,294,967,295 |
| `euint64` | 64-bit unsigned integer | Large numbers |
| `euint128` | 128-bit unsigned integer | Very large numbers |
| `ebool` | Encrypted boolean | true/false |
| `eaddress` | Encrypted address | Ethereum addresses |

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/your-org/fhevm-react-template
cd fhevm-react-template

# Install dependencies
npm install

# Build SDK
cd packages/fhevm-sdk
npm run build
```

### Running Examples

```bash
# Next.js showcase
cd examples/nextjs-showcase
npm install
npm run dev

# React example
cd examples/react-example
npm install
npm run dev

# Sports betting
cd examples/sports-betting
npm install
npm run dev

# Vanilla JavaScript
cd examples/vanilla-js
npm install
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run coverage

# Type checking
npm run type-check
```

## Use Cases

This SDK enables various confidential dApp use cases:

- **Gaming**: Hidden game states, private player strategies
- **DeFi**: Confidential trading, private balances
- **Voting**: Anonymous voting with verifiable results
- **Auctions**: Sealed-bid auctions with FHE
- **Healthcare**: Private medical data on-chain
- **Identity**: Confidential identity verification

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Your dApp                      │
│  (React, Next.js, Vue, Vanilla JS, etc.)       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              @fhevm/sdk                         │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Core Functions │  │   React Hooks    │   │
│  └──────────────────┘  └──────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              fhevmjs Library                    │
│         (Encryption/Decryption)                 │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐   ┌──────────────────┐
│   Gateway    │   │  Smart Contract  │
│   Service    │   │   (Blockchain)   │
└──────────────┘   └──────────────────┘
```

## Performance

- **Initialization**: ~2-5 seconds (one-time per session)
- **Encryption**: ~100-500ms per value
- **Decryption**: ~2-5 seconds (includes signature)
- **Bundle Size**: ~150KB (minified + gzipped)

## Browser Support

- Chrome 89+
- Firefox 89+
- Safari 15+
- Edge 89+

Requires support for:
- ES Modules
- BigInt
- WebAssembly
- Async/Await

## Security

- All encryption happens client-side
- Private keys never leave the user's device
- Smart contracts never see plaintext values
- Decryption requires explicit permission via `FHE.allow()`
- EIP-712 signatures for decryption requests

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Templates

Framework-specific template references are available in the `templates/` directory:

- **Next.js**: Complete implementation in [examples/nextjs-showcase](./examples/nextjs-showcase/)
- **React**: Modern React + Vite implementation in [examples/react-example](./examples/react-example/)
- **Vue.js**: Framework-agnostic SDK works seamlessly with Vue
- **Node.js**: Server-side integration examples and patterns

Each template directory contains usage guides and best practices for that framework.

## Roadmap

- [x] Universal framework-agnostic SDK
- [x] React hooks and integration
- [x] Next.js complete template with App Router
- [x] React + Vite example with TypeScript
- [x] API routes for server-side operations
- [x] Complete component library
- [x] TypeScript support with full types
- [x] Component-based React architecture
- [ ] Support for more encrypted types (eint256, efloat)
- [ ] Vue.js specific hooks and composables
- [ ] Angular integration
- [ ] Batch encryption optimization
- [ ] Offline signature support
- [ ] Hardware wallet integration
- [ ] Mobile SDK (React Native)

## Community

- **Discord**: [Join our community](https://discord.gg/zama)
- **Twitter**: [@zama_fhe](https://twitter.com/zama_fhe)
- **Blog**: [zama.ai/blog](https://www.zama.ai/blog)
- **YouTube**: [Video tutorials](https://youtube.com/@zama_fhe)

## Support

Need help?

- Check the [documentation](./docs/)
- Browse [examples](./examples/)
- Ask on [Discord](https://discord.gg/zama)
- Open an [issue](https://github.com/zama-ai/fhevm/issues)

## License

MIT License - see [LICENSE](./LICENSE) for details

## Acknowledgments

Built with:
- [fhevmjs](https://github.com/zama-ai/fhevmjs) - Core FHE functionality
- [ethers.js](https://docs.ethers.org/) - Ethereum interactions
- [React](https://react.dev/) - UI framework for examples
- [Next.js](https://nextjs.org/) - React framework for examples
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Video Demo

Watch our video demonstration to see the SDK in action:

**📥 Download Required**: The demo video must be downloaded to view.

[Download demo.mp4]

The demo covers:
1. Wallet connection and setup
2. FHEVM initialization
3. Encrypting sensitive data
4. Making confidential transactions
5. Decrypting results
6. Live sports betting example

## Live Example

**Try it live**: [Confidential Sports Betting Platform](https://fhe-sports-betting.vercel.app/)

Experience our production-ready example:
- Connect wallet and place encrypted bets
- See FHE encryption in action
- Monitor confidential betting pools
- Claim winnings privately

## Learn More

- **GitHub Repository**: [https://github.com/BrockKunde/fhevm-react-template](https://github.com/BrockKunde/fhevm-react-template)
- **Live Demo**: [https://fhe-sports-betting.vercel.app/](https://fhe-sports-betting.vercel.app/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Fully Homomorphic Encryption](https://www.zama.ai/post/what-is-fully-homomorphic-encryption-fhe)
- [Zama Technology](https://www.zama.ai/)

---

**Built with Privacy. Powered by FHE.**

**Start building confidential dApps today!**

**Repository**: [https://github.com/BrockKunde/fhevm-react-template](https://github.com/BrockKunde/fhevm-react-template)
