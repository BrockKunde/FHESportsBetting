'use client';

import React, { useState } from 'react';
import { useEncryptInput } from '@fhevm/sdk/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BankingExampleProps {
  userAddress: string;
}

export const BankingExample: React.FC<BankingExampleProps> = ({ userAddress }) => {
  const { encrypt, isEncrypting } = useEncryptInput();
  const [amount, setAmount] = useState('1000');
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [result, setResult] = useState<string>('');

  const contractAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const handleBankingAction = async () => {
    try {
      const numAmount = parseInt(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setResult('Please enter a valid amount');
        return;
      }

      // Encrypt the amount
      const encrypted = await encrypt({
        values: [{ value: numAmount, type: 'euint64' }],
        contractAddress,
        userAddress,
      });

      // Simulate the banking action
      setResult(
        `${action.charAt(0).toUpperCase() + action.slice(1)} of ${numAmount} tokens executed successfully!\n` +
        `Transaction encrypted with FHE - amount remains confidential on-chain.`
      );
    } catch (err) {
      setResult('Transaction failed');
      console.error('Banking action error:', err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        🏦 Confidential Banking
      </h3>
      <p className="text-slate-600 text-sm mb-4">
        Perform banking operations with encrypted balances
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <Button
          onClick={handleBankingAction}
          disabled={isEncrypting}
          variant="success"
          className="w-full"
        >
          {isEncrypting ? 'Processing...' : `Execute ${action}`}
        </Button>

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm whitespace-pre-line">{result}</p>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">Privacy Feature:</span> Your account balance
            remains encrypted on-chain. Only you can decrypt and view your actual balance.
          </p>
        </div>
      </div>
    </div>
  );
};
