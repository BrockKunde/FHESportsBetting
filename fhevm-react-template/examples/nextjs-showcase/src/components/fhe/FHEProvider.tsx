'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { createFhevmClient, initFhevm } from '@fhevm/sdk';
import type { FhevmClient } from '@fhevm/sdk';

interface FHEContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
}

const FHEContext = createContext<FHEContextType>({
  client: null,
  isInitialized: false,
  isInitializing: false,
  error: null,
});

export const useFHEContext = () => useContext(FHEContext);

interface FHEProviderProps {
  children: React.ReactNode;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

export const FHEProvider: React.FC<FHEProviderProps> = ({
  children,
  provider,
  signer,
}) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!provider || !signer || isInitialized || isInitializing) return;

    const initialize = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        const fhevmClient = createFhevmClient({ provider, signer });
        await initFhevm(fhevmClient);
        setClient(fhevmClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize FHE'));
        console.error('FHE initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [provider, signer, isInitialized, isInitializing]);

  return (
    <FHEContext.Provider value={{ client, isInitialized, isInitializing, error }}>
      {children}
    </FHEContext.Provider>
  );
};
