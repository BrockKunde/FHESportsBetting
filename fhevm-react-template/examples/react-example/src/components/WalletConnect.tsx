import { useState } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'pending'>('pending');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setStatus('Please install MetaMask!');
        setStatusType('error');
        return;
      }

      setIsConnecting(true);
      setStatus('Connecting to MetaMask...');
      setStatusType('pending');

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setStatus(`✓ Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      setStatusType('success');
      setConnected(true);
      setIsConnecting(false);
      onConnect(address);
    } catch (error: any) {
      console.error('Connection error:', error);
      setStatus(`Error: ${error.message}`);
      setStatusType('error');
      setIsConnecting(false);
    }
  };

  return (
    <div className="section">
      <h2>1. Connect Wallet</h2>
      <button onClick={connectWallet} disabled={isConnecting || connected}>
        {connected ? 'Connected' : isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      {status && <div className={`status ${statusType}`}>{status}</div>}
    </div>
  );
}
