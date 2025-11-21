import { useEffect, useState } from 'react';
import { createFhevmClient, initFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';

interface FHEVMStatusProps {
  isConnected: boolean;
  onInitialized: (initialized: boolean) => void;
}

export default function FHEVMStatus({ isConnected, onInitialized }: FHEVMStatusProps) {
  const [status, setStatus] = useState<string>('Connect wallet to initialize FHEVM');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'pending'>('pending');

  useEffect(() => {
    if (isConnected) {
      initializeFhevm();
    }
  }, [isConnected]);

  const initializeFhevm = async () => {
    try {
      setStatus('⏳ Initializing FHEVM...');
      setStatusType('pending');

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create FHEVM client
      const client = createFhevmClient({ provider, signer });

      // Initialize FHEVM
      await initFhevm(client);

      setStatus('✓ FHEVM initialized and ready!');
      setStatusType('success');
      onInitialized(true);
    } catch (error: any) {
      console.error('FHEVM initialization error:', error);
      setStatus(`Error: ${error.message}`);
      setStatusType('error');
      onInitialized(false);
    }
  };

  return (
    <div className="section">
      <h2>2. FHEVM Initialization</h2>
      <div className={`status ${statusType}`}>{status}</div>
      <div className="info-box">
        <strong>Note:</strong> FHEVM automatically initializes when you connect your wallet.
        This may take a few seconds as it downloads the necessary encryption keys.
      </div>
    </div>
  );
}
