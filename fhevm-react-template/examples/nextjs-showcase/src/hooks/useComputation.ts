/**
 * Custom hook for homomorphic computation
 */

import { useState, useCallback } from 'react';

export type ComputationOperation = 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq';

export interface ComputationParams {
  operation: ComputationOperation;
  value1: number;
  value2: number;
}

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(async (params: ComputationParams) => {
    setIsComputing(true);
    setError(null);
    setResult(null);

    try {
      const { operation, value1, value2 } = params;

      // Simulate computation on encrypted values
      // In production, this would be a smart contract call
      let computedResult: any;

      switch (operation) {
        case 'add':
          computedResult = { encrypted: true, operation, result: value1 + value2 };
          break;
        case 'sub':
          computedResult = { encrypted: true, operation, result: value1 - value2 };
          break;
        case 'mul':
          computedResult = { encrypted: true, operation, result: value1 * value2 };
          break;
        case 'div':
          computedResult = { encrypted: true, operation, result: Math.floor(value1 / value2) };
          break;
        case 'gt':
          computedResult = { encrypted: true, operation, result: value1 > value2 };
          break;
        case 'lt':
          computedResult = { encrypted: true, operation, result: value1 < value2 };
          break;
        case 'eq':
          computedResult = { encrypted: true, operation, result: value1 === value2 };
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      setResult(computedResult);
      return computedResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Computation failed');
      setError(error);
      throw error;
    } finally {
      setIsComputing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    result,
    error,
    reset,
  };
}
