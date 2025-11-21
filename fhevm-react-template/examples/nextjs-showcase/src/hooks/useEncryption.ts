/**
 * Custom hook for encryption operations
 */

import { useState, useCallback } from 'react';
import { useEncryptInput } from '@fhevm/sdk/react';
import type { EncryptInputParams } from '@fhevm/sdk';

export interface UseEncryptionOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export function useEncryption(options?: UseEncryptionOptions) {
  const { encrypt: sdkEncrypt, isEncrypting } = useEncryptInput();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (params: EncryptInputParams) => {
      setError(null);
      setResult(null);

      try {
        const encryptedResult = await sdkEncrypt(params);
        setResult(encryptedResult);
        options?.onSuccess?.(encryptedResult);
        return encryptedResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        options?.onError?.(error);
        throw error;
      }
    },
    [sdkEncrypt, options]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    encrypt,
    isEncrypting,
    result,
    error,
    reset,
  };
}
