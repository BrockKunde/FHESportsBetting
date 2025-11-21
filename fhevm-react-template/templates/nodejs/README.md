# Node.js Template for FHEVM

Server-side FHEVM integration for Node.js applications.

## Installation

```bash
npm install @fhevm/sdk ethers
```

## Basic Usage

```javascript
const { createFhevmClient, initFhevm, encryptInput } = require('@fhevm/sdk');
const { ethers } = require('ethers');

async function main() {
  // Create provider
  const provider = new ethers.JsonRpcProvider('https://devnet.zama.ai');

  // For server-side, use a wallet
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

  // Initialize FHEVM
  const client = createFhevmClient({ provider, signer: wallet });
  await initFhevm(client);

  // Encrypt values
  const encrypted = await encryptInput({
    values: [{ value: 100, type: 'euint32' }],
    contractAddress: '0x...',
    userAddress: wallet.address,
  });

  console.log('Encrypted:', encrypted);
}

main();
```

## Use Cases

- Backend encryption services
- Smart contract deployment scripts
- Automated testing
- CLI tools

## Security Note

⚠️ **Important**: Never expose private keys in your code. Use environment variables:

```javascript
require('dotenv').config();
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
```

## Documentation

- [Getting Started](../../docs/getting-started.md)
- [API Reference](../../docs/api-reference.md)
