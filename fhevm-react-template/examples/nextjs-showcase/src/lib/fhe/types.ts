/**
 * Type definitions for FHE operations
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

export interface DecryptionParams {
  handle: bigint;
  contractAddress: string;
  userAddress: string;
}

export interface FHEClientConfig {
  gatewayUrl?: string;
  network?: string;
  chainId?: number;
}

export interface FHEOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
