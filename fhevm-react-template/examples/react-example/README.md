# FHEVM React Example

A modern React application demonstrating FHEVM SDK integration with TypeScript and Vite.

## Overview

This example showcases how to integrate the FHEVM SDK into a React application. It demonstrates:

- **Wallet Connection**: MetaMask integration
- **FHEVM Initialization**: Automatic initialization with status tracking
- **Encryption**: Interactive encryption with multiple data types
- **Decryption**: Permission-based decryption with EIP-712 signatures
- **TypeScript**: Full type safety throughout the application

## Features

- ✅ Modern React with TypeScript
- ✅ Component-based architecture
- ✅ Real-time status updates
- ✅ Error handling and validation
- ✅ Responsive UI design
- ✅ Vite for fast development

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Access to an FHEVM-compatible network

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
react-example/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx    # Wallet connection component
│   │   ├── FHEVMStatus.tsx      # FHEVM initialization status
│   │   ├── EncryptionDemo.tsx   # Encryption demo component
│   │   ├── DecryptionDemo.tsx   # Decryption demo component
│   │   └── CodeExample.tsx      # Code snippet display
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Application styles
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## SDK Integration

### Basic Usage

```typescript
import { createFhevmClient, initFhevm, encryptInput } from '@fhevm/sdk';
import { ethers } from 'ethers';

// Connect wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Create and initialize client
const client = createFhevmClient({ provider, signer });
await initFhevm(client);

// Encrypt data
const encrypted = await encryptInput({
  values: [{ value: 100, type: 'euint32' }],
  contractAddress: '0x...',
  userAddress: await signer.getAddress(),
});
```

### Component Example

```typescript
import { useState } from 'react';
import { encryptInput } from '@fhevm/sdk';

function EncryptionComponent({ userAddress }: { userAddress: string }) {
  const [value, setValue] = useState(0);

  const handleEncrypt = async () => {
    const encrypted = await encryptInput({
      values: [{ value, type: 'euint32' }],
      contractAddress: '0x...',
      userAddress,
    });
    console.log('Encrypted:', encrypted);
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <button onClick={handleEncrypt}>Encrypt</button>
    </div>
  );
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Encrypted Types Support

The SDK supports the following encrypted types:

| Type | Description | Range |
|------|-------------|-------|
| `euint8` | 8-bit unsigned integer | 0-255 |
| `euint16` | 16-bit unsigned integer | 0-65,535 |
| `euint32` | 32-bit unsigned integer | 0-4,294,967,295 |
| `euint64` | 64-bit unsigned integer | Large numbers |
| `euint128` | 128-bit unsigned integer | Very large numbers |
| `ebool` | Encrypted boolean | true/false |
| `eaddress` | Encrypted address | Ethereum addresses |

## Key Features Demonstrated

### 1. Wallet Connection
- MetaMask detection and connection
- Address display and management
- Connection state management

### 2. FHEVM Initialization
- Automatic initialization on wallet connect
- Status tracking and error handling
- Loading states and feedback

### 3. Data Encryption
- Multiple encrypted type support
- Contract address validation
- Real-time encryption feedback

### 4. Data Decryption
- Permission-based decryption
- EIP-712 signature handling
- Error handling for unauthorized access

## Development

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ethers.js** - Ethereum interactions
- **@fhevm/sdk** - FHE encryption/decryption

### Configuration

The project uses Vite with the following configuration:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
});
```

## Troubleshooting

### Common Issues

1. **MetaMask not detected**
   - Ensure MetaMask extension is installed
   - Try refreshing the page

2. **FHEVM initialization fails**
   - Check network connection
   - Ensure you're on a supported network
   - Check browser console for detailed errors

3. **Encryption fails**
   - Verify contract address is valid
   - Ensure FHEVM is properly initialized
   - Check value is within type range

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [ethers.js Documentation](https://docs.ethers.org/)

## License

MIT
