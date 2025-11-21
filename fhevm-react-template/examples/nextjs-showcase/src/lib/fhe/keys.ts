/**
 * Key management utilities for FHEVM
 */

/**
 * Fetch public key from gateway
 */
export async function fetchPublicKey(gatewayUrl?: string): Promise<string> {
  const url = gatewayUrl || process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.zama.ai';

  try {
    const response = await fetch(`${url}/public-key`);
    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error('Failed to fetch public key:', error);
    throw error;
  }
}

/**
 * Get contract-specific public key
 */
export async function getContractPublicKey(
  contractAddress: string,
  gatewayUrl?: string
): Promise<string> {
  const url = gatewayUrl || process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.zama.ai';

  try {
    const response = await fetch(`${url}/public-key/${contractAddress}`);
    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error('Failed to fetch contract public key:', error);
    throw error;
  }
}

/**
 * Validate public key format
 */
export function isValidPublicKey(key: string): boolean {
  // Add validation logic for public key format
  return key && key.length > 0;
}
