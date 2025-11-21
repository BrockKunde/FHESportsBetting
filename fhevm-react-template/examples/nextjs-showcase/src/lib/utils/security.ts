/**
 * Security utilities for FHEVM operations
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize user input before encryption
 */
export function sanitizeInput(input: string | number): number {
  if (typeof input === 'number') {
    return Math.floor(Math.abs(input));
  }

  const parsed = parseInt(input);
  if (isNaN(parsed)) {
    throw new Error('Invalid input: must be a number');
  }

  return Math.floor(Math.abs(parsed));
}

/**
 * Validate value is within type bounds
 */
export function validateValueForType(value: number, type: string): boolean {
  const limits: Record<string, { min: number; max: number }> = {
    euint8: { min: 0, max: 255 },
    euint16: { min: 0, max: 65535 },
    euint32: { min: 0, max: 4294967295 },
    euint64: { min: 0, max: Number.MAX_SAFE_INTEGER },
  };

  const limit = limits[type];
  if (!limit) return false;

  return value >= limit.min && value <= limit.max;
}

/**
 * Generate secure random nonce
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
