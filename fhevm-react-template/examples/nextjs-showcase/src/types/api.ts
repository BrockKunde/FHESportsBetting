/**
 * API type definitions
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptAPIRequest {
  value: number | boolean | string;
  type: string;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptAPIRequest {
  handle: string;
  signature: string;
  contractAddress: string;
  userAddress: string;
}

export interface ComputeAPIRequest {
  operation: string;
  encryptedInputs: Array<{
    handle: string;
    type: string;
  }>;
}

export interface KeyAPIResponse {
  publicKey: string;
  contractAddress?: string;
}
