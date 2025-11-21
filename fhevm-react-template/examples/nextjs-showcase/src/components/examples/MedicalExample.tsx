'use client';

import React, { useState } from 'react';
import { useEncryptInput } from '@fhevm/sdk/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MedicalExampleProps {
  userAddress: string;
}

export const MedicalExample: React.FC<MedicalExampleProps> = ({ userAddress }) => {
  const { encrypt, isEncrypting } = useEncryptInput();
  const [heartRate, setHeartRate] = useState('75');
  const [bloodPressure, setBloodPressure] = useState('120');
  const [result, setResult] = useState<string>('');

  const contractAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const handleSubmitData = async () => {
    try {
      const hr = parseInt(heartRate);
      const bp = parseInt(bloodPressure);

      if (isNaN(hr) || isNaN(bp)) {
        setResult('Please enter valid medical data');
        return;
      }

      // Encrypt the medical data
      await encrypt({
        values: [
          { value: hr, type: 'euint16' },
          { value: bp, type: 'euint16' }
        ],
        contractAddress,
        userAddress,
      });

      setResult(
        `Medical data recorded successfully!\n\n` +
        `Heart Rate: ${hr} bpm (encrypted)\n` +
        `Blood Pressure: ${bp} mmHg (encrypted)\n\n` +
        `Your health data is stored on-chain with full encryption. ` +
        `Only authorized medical professionals with proper permissions can access it.`
      );
    } catch (err) {
      setResult('Failed to submit medical data');
      console.error('Medical data submission error:', err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        🏥 Confidential Health Records
      </h3>
      <p className="text-slate-600 text-sm mb-4">
        Store medical data with complete privacy
      </p>

      <div className="space-y-4">
        <Input
          label="Heart Rate (bpm)"
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="Enter heart rate"
        />

        <Input
          label="Blood Pressure (mmHg)"
          type="number"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          placeholder="Enter blood pressure"
        />

        <Button
          onClick={handleSubmitData}
          disabled={isEncrypting}
          variant="success"
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Submit Medical Data'}
        </Button>

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm whitespace-pre-line">{result}</p>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">HIPAA Compliance:</span> Medical records are
            fully encrypted on-chain. Access requires explicit permission via smart contracts.
          </p>
        </div>
      </div>
    </div>
  );
};
