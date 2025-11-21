/**
 * Client-side FHE operations
 * All encryption happens on the client to ensure security
 */

import { createFhevmClient, encryptInput, type EncryptInputParams } from '@fhevm/sdk';
import { ethers } from 'ethers';

/**
 * Initialize FHE client for browser
 */
export async function initializeFHEClient(
  provider: ethers.BrowserProvider,
  signer: ethers.Signer
) {
  const client = createFhevmClient({ provider, signer });
  return client;
}

/**
 * Encrypt a single value
 */
export async function encryptValue(params: EncryptInputParams) {
  return await encryptInput(params);
}

/**
 * Encrypt multiple values
 */
export async function encryptMultipleValues(
  values: Array<{ value: number | boolean; type: string }>,
  contractAddress: string,
  userAddress: string
) {
  return await encryptInput({
    values,
    contractAddress,
    userAddress,
  });
}

/**
 * Validate encrypted type
 */
export function isValidEncryptedType(type: string): boolean {
  const validTypes = [
    'euint8',
    'euint16',
    'euint32',
    'euint64',
    'euint128',
    'ebool',
    'eaddress',
  ];
  return validTypes.includes(type);
}

/**
 * Get type limits
 */
export function getTypeLimits(type: string): { min: number; max: number } | null {
  const limits: Record<string, { min: number; max: number }> = {
    euint8: { min: 0, max: 255 },
    euint16: { min: 0, max: 65535 },
    euint32: { min: 0, max: 4294967295 },
    euint64: { min: 0, max: Number.MAX_SAFE_INTEGER },
  };

  return limits[type] || null;
}
