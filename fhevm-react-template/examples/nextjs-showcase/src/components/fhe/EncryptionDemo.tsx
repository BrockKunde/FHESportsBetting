'use client';

import React, { useState } from 'react';
import { useEncryptInput } from '@fhevm/sdk/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EncryptionDemoProps {
  userAddress: string;
}

export const EncryptionDemo: React.FC<EncryptionDemoProps> = ({ userAddress }) => {
  const { encrypt, isEncrypting } = useEncryptInput();
  const [value, setValue] = useState('100');
  const [type, setType] = useState<'euint8' | 'euint16' | 'euint32' | 'euint64'>('euint32');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const contractAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const handleEncrypt = async () => {
    setError('');
    setResult(null);

    try {
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        return;
      }

      const encrypted = await encrypt({
        values: [{ value: numValue, type }],
        contractAddress,
        userAddress,
      });

      setResult(encrypted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
      console.error('Encryption error:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">
        Encryption Demo
      </h2>
      <p className="text-slate-600 mb-6">
        Encrypt values using FHEVM for confidential on-chain operations
      </p>

      <div className="space-y-4">
        <Input
          label="Value to Encrypt"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Encrypted Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="euint8">euint8 (0-255)</option>
            <option value="euint16">euint16 (0-65,535)</option>
            <option value="euint32">euint32 (0-4,294,967,295)</option>
            <option value="euint64">euint64 (Large numbers)</option>
          </select>
        </div>

        <Button
          onClick={handleEncrypt}
          disabled={isEncrypting}
          variant="success"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Encryption Successful!</h3>
            <div className="space-y-2 text-sm">
              <p className="text-green-800">
                <span className="font-medium">Handle:</span>{' '}
                <code className="bg-green-100 px-2 py-1 rounded">
                  {result.handles[0].toString().slice(0, 20)}...
                </code>
              </p>
              <p className="text-green-800">
                <span className="font-medium">Input Proof:</span>{' '}
                <code className="bg-green-100 px-2 py-1 rounded break-all">
                  {result.inputProof.slice(0, 40)}...
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
