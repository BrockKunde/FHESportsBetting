'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useFhevmClient, useEncryptInput, useDecryptOutput } from '@fhevm/sdk/react';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        await newProvider.send('eth_requestAccounts', []);
        const newSigner = await newProvider.getSigner();
        const addr = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setAddress(addr);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this application');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <FHEProvider provider={provider} signer={signer}>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              FHEVM SDK Showcase
            </h1>
            <p className="text-xl text-slate-600">
              Universal SDK for building confidential dApps with Fully Homomorphic Encryption
            </p>
          </div>

          {/* Wallet Connection */}
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                1. Connect Wallet
              </h2>
              {!address ? (
                <Button onClick={connectWallet} variant="primary">
                  Connect MetaMask
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-green-600 font-medium">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Key Manager */}
          {address && (
            <Card className="mb-8">
              <div className="p-6">
                <KeyManager />
              </div>
            </Card>
          )}

          {/* Encryption Demo */}
          {address && (
            <Card className="mb-8">
              <div className="p-6">
                <EncryptionDemo userAddress={address} />
              </div>
            </Card>
          )}

          {/* Computation Demo */}
          {address && (
            <Card className="mb-8">
              <div className="p-6">
                <ComputationDemo userAddress={address} />
              </div>
            </Card>
          )}

          {/* Example Use Cases */}
          {address && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Example Use Cases
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <div className="p-6">
                      <BankingExample userAddress={address} />
                    </div>
                  </Card>
                  <Card>
                    <div className="p-6">
                      <MedicalExample userAddress={address} />
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Links */}
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                More Examples
              </h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://fhe-sports-betting.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    → Confidential Sports Betting Platform
                  </a>
                </li>
                <li>
                  <a
                    href="/examples/vanilla-js"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    → Vanilla JavaScript Example
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/BrockKunde/fhevm-react-template"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    → GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </main>
    </FHEProvider>
  );
}
