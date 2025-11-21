import { useState } from 'react';
import { encryptInput } from '@fhevm/sdk';

interface EncryptionDemoProps {
  isEnabled: boolean;
  userAddress: string;
}

export default function EncryptionDemo({ isEnabled, userAddress }: EncryptionDemoProps) {
  const [value, setValue] = useState<number>(100);
  const [type, setType] = useState<string>('euint32');
  const [contractAddress, setContractAddress] = useState<string>('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [result, setResult] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleEncrypt = async () => {
    try {
      if (!isEnabled) {
        setResult('<div class="status error">Please connect wallet and initialize FHEVM first</div>');
        return;
      }

      if (!contractAddress || !contractAddress.startsWith('0x')) {
        setResult('<div class="status error">Please enter a valid contract address</div>');
        return;
      }

      setIsEncrypting(true);
      setResult('<div class="status pending">⏳ Encrypting value...</div>');

      // Encrypt the input
      const encrypted = await encryptInput({
        values: [{ value, type }],
        contractAddress: contractAddress,
        userAddress: userAddress,
      });

      setResult(`
        <div class="status success">✓ Encryption successful!</div>
        <div class="result-box">
          <strong>Encrypted Handle:</strong><br>
          ${encrypted.handles[0]}<br><br>
          <strong>Input Proof:</strong><br>
          ${encrypted.inputProof.substring(0, 100)}...
        </div>
        <div class="info-box">
          <strong>Usage:</strong> Pass <code>encrypted.handles[0]</code> and <code>encrypted.inputProof</code>
          to your smart contract function. The contract can then operate on the encrypted value without seeing it!
        </div>
      `);
    } catch (error: any) {
      console.error('Encryption error:', error);
      setResult(`<div class="status error">Error: ${error.message}</div>`);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="section">
      <h2>3. Encrypt Input</h2>
      <div className="input-group">
        <label htmlFor="valueInput">Value to Encrypt:</label>
        <input
          type="number"
          id="valueInput"
          placeholder="Enter a number (e.g., 100)"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="typeSelect">Data Type:</label>
        <select
          id="typeSelect"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="euint8">euint8 (0-255)</option>
          <option value="euint16">euint16 (0-65535)</option>
          <option value="euint32">euint32 (0-4294967295)</option>
          <option value="euint64">euint64 (large numbers)</option>
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="contractAddress">Contract Address:</label>
        <input
          type="text"
          id="contractAddress"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <button onClick={handleEncrypt} disabled={!isEnabled || isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
      </button>
      {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
    </div>
  );
}
