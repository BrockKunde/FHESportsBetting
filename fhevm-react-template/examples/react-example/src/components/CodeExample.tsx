export default function CodeExample() {
  return (
    <div className="section">
      <h2>5. Code Example</h2>
      <p style={{ marginBottom: '1rem' }}>This example demonstrates the FHEVM SDK usage in React with TypeScript:</p>
      <div className="result-box">
        <pre>{`import { createFhevmClient, initFhevm, encryptInput } from '@fhevm/sdk';
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
await contract.myFunction(
  encrypted.handles[0],
  encrypted.inputProof
);`}</pre>
      </div>
    </div>
  );
}
