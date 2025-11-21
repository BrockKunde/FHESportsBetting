import { useState } from 'react';
import { decryptOutput } from '@fhevm/sdk';

interface DecryptionDemoProps {
  isEnabled: boolean;
  userAddress: string;
}

export default function DecryptionDemo({ isEnabled, userAddress }: DecryptionDemoProps) {
  const [handle, setHandle] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [result, setResult] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = async () => {
    try {
      if (!isEnabled) {
        setResult('<div class="status error">Please connect wallet and initialize FHEVM first</div>');
        return;
      }

      if (!handle || !handle.startsWith('0x')) {
        setResult('<div class="status error">Please enter a valid encrypted handle</div>');
        return;
      }

      if (!contractAddress || !contractAddress.startsWith('0x')) {
        setResult('<div class="status error">Please enter a valid contract address</div>');
        return;
      }

      setIsDecrypting(true);
      setResult('<div class="status pending">⏳ Requesting decryption signature...</div>');

      // Decrypt the output
      const decrypted = await decryptOutput({
        handle: handle,
        contractAddress: contractAddress,
        userAddress: userAddress,
      });

      setResult(`
        <div class="status success">✓ Decryption successful!</div>
        <div class="result-box">
          <strong>Decrypted Value:</strong><br>
          ${decrypted}
        </div>
        <div class="info-box">
          <strong>Note:</strong> Decryption requires proper permissions. The contract must have called
          <code>FHE.allow(handle, userAddress)</code> to grant you access to this encrypted value.
        </div>
      `);
    } catch (error: any) {
      console.error('Decryption error:', error);
      setResult(`<div class="status error">Error: ${error.message}. Make sure you have permission to decrypt this value.</div>`);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="section">
      <h2>4. Decrypt Output</h2>
      <div className="input-group">
        <label htmlFor="handleInput">Encrypted Handle:</label>
        <input
          type="text"
          id="handleInput"
          placeholder="Enter encrypted handle from contract"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="contractAddressDecrypt">Contract Address:</label>
        <input
          type="text"
          id="contractAddressDecrypt"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <button onClick={handleDecrypt} disabled={!isEnabled || isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
      </button>
      {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
      <div className="info-box">
        <strong>Note:</strong> Decryption requires a valid encrypted handle from the contract
        and proper permissions via EIP-712 signature.
      </div>
    </div>
  );
}
