/**
 * FHE-related type definitions
 */

export type EncryptedType =
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'ebool'
  | 'eaddress';

export interface EncryptedValue {
  value: number | boolean | string;
  type: EncryptedType;
}

export interface EncryptionResult {
  handles: bigint[];
  inputProof: string;
}

export interface DecryptionRequest {
  handle: bigint;
  contractAddress: string;
  userAddress?: string;
}

export interface FHEConfig {
  gatewayUrl?: string;
  network?: string;
  chainId?: number;
}

export interface FHEStatus {
  initialized: boolean;
  publicKeyAvailable: boolean;
  networkConnected: boolean;
}
