/**
 * Custom React hook for FHE operations
 */

import { useState, useCallback } from 'react';
import { useFhevmClient, useEncryptInput, useDecryptOutput } from '@fhevm/sdk/react';
import type { FhevmClient } from '@fhevm/sdk';
import { ethers } from 'ethers';

export interface UseFHEResult {
  client: FhevmClient | null;
  isInitialized: boolean;
  encrypt: (value: number, type: string, contractAddress: string, userAddress: string) => Promise<any>;
  decrypt: (handle: bigint, contractAddress: string) => Promise<any>;
  isEncrypting: boolean;
  isDecrypting: boolean;
  error: Error | null;
}

export function useFHE(
  provider: ethers.BrowserProvider | null,
  signer: ethers.Signer | null
): UseFHEResult {
  const { client, isInitialized, error } = useFhevmClient({
    provider: provider!,
    signer: signer!,
  });

  const { encrypt: encryptFn, isEncrypting } = useEncryptInput();
  const { decrypt: decryptFn, isDecrypting } = useDecryptOutput();

  const encrypt = useCallback(
    async (value: number, type: string, contractAddress: string, userAddress: string) => {
      if (!isInitialized) {
        throw new Error('FHE not initialized');
      }

      return await encryptFn({
        values: [{ value, type }],
        contractAddress,
        userAddress,
      });
    },
    [isInitialized, encryptFn]
  );

  const decrypt = useCallback(
    async (handle: bigint, contractAddress: string) => {
      if (!isInitialized) {
        throw new Error('FHE not initialized');
      }

      return await decryptFn({
        handle,
        contractAddress,
      });
    },
    [isInitialized, decryptFn]
  );

  return {
    client,
    isInitialized,
    encrypt,
    decrypt,
    isEncrypting,
    isDecrypting,
    error,
  };
}
