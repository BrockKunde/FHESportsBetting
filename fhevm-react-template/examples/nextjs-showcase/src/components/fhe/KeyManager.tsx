'use client';

import React, { useState } from 'react';
import { useFHEContext } from './FHEProvider';
import { Button } from '@/components/ui/Button';

export const KeyManager: React.FC = () => {
  const { client, isInitialized, isInitializing, error } = useFHEContext();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">
        2. FHEVM Status & Key Management
      </h2>

      <div className="space-y-4">
        {/* Initialization Status */}
        <div className="flex items-center gap-3">
          {isInitializing && (
            <>
              <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-600 font-medium">Initializing FHEVM...</p>
            </>
          )}
          {isInitialized && (
            <>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <p className="text-green-600 font-medium">FHEVM initialized and ready</p>
            </>
          )}
          {error && (
            <>
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <p className="text-red-600 font-medium">Error: {error.message}</p>
            </>
          )}
        </div>

        {/* Details Toggle */}
        {isInitialized && (
          <div>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="secondary"
              size="sm"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>

            {showDetails && client && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">FHE Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Network:</span>
                    <span className="font-medium">FHEVM Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gateway:</span>
                    <span className="font-medium text-xs">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Public Key:</span>
                    <span className="font-medium text-xs">Available</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Security:</span> All encryption happens client-side.
                    Your private keys never leave this device.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
