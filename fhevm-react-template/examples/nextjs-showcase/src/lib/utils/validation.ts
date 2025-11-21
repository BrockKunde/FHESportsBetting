/**
 * Validation utilities
 */

/**
 * Validate encryption parameters
 */
export function validateEncryptionParams(params: {
  value: any;
  type: string;
  contractAddress: string;
  userAddress: string;
}): { valid: boolean; error?: string } {
  const { value, type, contractAddress, userAddress } = params;

  // Validate addresses
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
    return { valid: false, error: 'Invalid user address' };
  }

  // Validate type
  const validTypes = ['euint8', 'euint16', 'euint32', 'euint64', 'euint128', 'ebool', 'eaddress'];
  if (!validTypes.includes(type)) {
    return { valid: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` };
  }

  // Validate value based on type
  if (type === 'ebool') {
    if (typeof value !== 'boolean') {
      return { valid: false, error: 'Value must be boolean for ebool type' };
    }
  } else if (type === 'eaddress') {
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return { valid: false, error: 'Value must be valid address for eaddress type' };
    }
  } else {
    // Numeric types
    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, error: 'Value must be a number' };
    }

    // Check bounds
    const limits: Record<string, number> = {
      euint8: 255,
      euint16: 65535,
      euint32: 4294967295,
      euint64: Number.MAX_SAFE_INTEGER,
    };

    const max = limits[type];
    if (value < 0 || value > max) {
      return { valid: false, error: `Value must be between 0 and ${max} for ${type}` };
    }
  }

  return { valid: true };
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(config: {
  rpcUrl?: string;
  chainId?: number;
  gatewayUrl?: string;
}): { valid: boolean; error?: string } {
  if (config.rpcUrl && !config.rpcUrl.startsWith('http')) {
    return { valid: false, error: 'RPC URL must start with http or https' };
  }

  if (config.chainId !== undefined && config.chainId <= 0) {
    return { valid: false, error: 'Chain ID must be positive' };
  }

  if (config.gatewayUrl && !config.gatewayUrl.startsWith('http')) {
    return { valid: false, error: 'Gateway URL must start with http or https' };
  }

  return { valid: true };
}
