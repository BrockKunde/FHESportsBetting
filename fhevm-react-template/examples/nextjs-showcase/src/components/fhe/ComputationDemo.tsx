'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ComputationDemoProps {
  userAddress: string;
}

export const ComputationDemo: React.FC<ComputationDemoProps> = ({ userAddress }) => {
  const [value1, setValue1] = useState('10');
  const [value2, setValue2] = useState('20');
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'gt' | 'lt' | 'eq'>('add');
  const [result, setResult] = useState<string>('');

  const handleCompute = async () => {
    try {
      const num1 = parseInt(value1);
      const num2 = parseInt(value2);

      if (isNaN(num1) || isNaN(num2)) {
        setResult('Please enter valid numbers');
        return;
      }

      // Simulate homomorphic computation
      let computedResult: string;
      switch (operation) {
        case 'add':
          computedResult = `Encrypted(${num1} + ${num2}) = Encrypted(${num1 + num2})`;
          break;
        case 'sub':
          computedResult = `Encrypted(${num1} - ${num2}) = Encrypted(${num1 - num2})`;
          break;
        case 'mul':
          computedResult = `Encrypted(${num1} × ${num2}) = Encrypted(${num1 * num2})`;
          break;
        case 'gt':
          computedResult = `Encrypted(${num1} > ${num2}) = Encrypted(${num1 > num2})`;
          break;
        case 'lt':
          computedResult = `Encrypted(${num1} < ${num2}) = Encrypted(${num1 < num2})`;
          break;
        case 'eq':
          computedResult = `Encrypted(${num1} == ${num2}) = Encrypted(${num1 === num2})`;
          break;
      }

      setResult(computedResult);
    } catch (err) {
      setResult('Computation failed');
      console.error('Computation error:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">
        Homomorphic Computation Demo
      </h2>
      <p className="text-slate-600 mb-6">
        Perform computations on encrypted data without revealing the values
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Input
          label="First Value"
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Enter first number"
        />
        <Input
          label="Second Value"
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder="Enter second number"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Operation
        </label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value as any)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="add">Addition (+)</option>
          <option value="sub">Subtraction (-)</option>
          <option value="mul">Multiplication (×)</option>
          <option value="gt">Greater Than (&gt;)</option>
          <option value="lt">Less Than (&lt;)</option>
          <option value="eq">Equals (==)</option>
        </select>
      </div>

      <Button onClick={handleCompute} variant="primary">
        Compute on Encrypted Data
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Computation Result:</h3>
          <p className="text-blue-800 font-mono text-sm">{result}</p>
          <p className="text-blue-600 text-xs mt-2">
            Note: Actual computation happens on-chain with encrypted values
          </p>
        </div>
      )}
    </div>
  );
};
