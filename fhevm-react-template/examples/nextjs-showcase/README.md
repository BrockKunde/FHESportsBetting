# Next.js FHEVM Showcase

Interactive demonstration of the FHEVM SDK features with complete integration examples.

## Features

- **Wallet Connection**: MetaMask integration with automatic network detection
- **FHEVM Initialization**: Visual status tracking and error handling
- **Encryption Demo**: Encrypt values with multiple data types
- **Computation Demo**: Homomorphic operations on encrypted data
- **Key Management**: Public key fetching and management
- **Banking Example**: Confidential banking operations
- **Medical Example**: Private health record management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- FHEVM testnet access

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the showcase.

## Project Structure

```
nextjs-showcase/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── api/                # API routes
│   │       ├── fhe/            # FHE operations
│   │       │   ├── route.ts
│   │       │   ├── encrypt/route.ts
│   │       │   ├── decrypt/route.ts
│   │       │   └── compute/route.ts
│   │       └── keys/route.ts   # Key management
│   ├── components/             # React components
│   │   ├── ui/                 # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── fhe/                # FHE components
│   │   │   ├── FHEProvider.tsx
│   │   │   ├── EncryptionDemo.tsx
│   │   │   ├── ComputationDemo.tsx
│   │   │   └── KeyManager.tsx
│   │   └── examples/           # Use case examples
│   │       ├── BankingExample.tsx
│   │       └── MedicalExample.tsx
│   ├── lib/                    # Utility libraries
│   │   ├── fhe/                # FHE integration
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── keys.ts
│   │   │   └── types.ts
│   │   └── utils/              # Utilities
│   │       ├── security.ts
│   │       └── validation.ts
│   ├── hooks/                  # Custom hooks
│   │   ├── useFHE.ts
│   │   ├── useEncryption.ts
│   │   └── useComputation.ts
│   └── types/                  # TypeScript types
│       ├── fhe.ts
│       └── api.ts
└── package.json
```

## SDK Integration Examples

### Basic Encryption

```typescript
import { useEncryptInput } from '@fhevm/sdk/react';

const { encrypt, isEncrypting } = useEncryptInput();

const result = await encrypt({
  values: [{ value: 100, type: 'euint32' }],
  contractAddress: '0x...',
  userAddress: address,
});
```

### Homomorphic Computation

```typescript
// Computation happens on encrypted values on-chain
const computedResult = await contract.add(encryptedA, encryptedB);
```

### Decryption with Permissions

```typescript
import { useDecryptOutput } from '@fhevm/sdk/react';

const { decrypt, isDecrypting } = useDecryptOutput();

const plaintext = await decrypt({
  handle: encryptedValue,
  contractAddress: '0x...',
});
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file with the following variables:

```env
NEXT_PUBLIC_RPC_URL=https://devnet.zama.ai
NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai
NEXT_PUBLIC_CHAIN_ID=9000
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [API Reference](../../docs/api-reference.md)
- [Getting Started Guide](../../docs/getting-started.md)

## License

MIT
