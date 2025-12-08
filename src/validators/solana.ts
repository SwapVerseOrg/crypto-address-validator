import { ValidationResult } from '../types.js';
import { base58Decode } from '../utils/base58.js';

/**
 * Validate Solana address
 */
export function validateSolana(address: string): ValidationResult {
    // Solana uses base58 encoding, 32-44 characters
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    // Decode and verify it's exactly 32 bytes (Ed25519 public key)
    const decoded = base58Decode(address);
    if (!decoded || decoded.length !== 32) {
        return { isValid: false, network: null, network_name: null };
    }

    // Solana addresses are Ed25519 public keys
    // All bytes should be valid (no specific version byte like Bitcoin)
    return {
        isValid: true,
        network: 'mainnet',
        network_name: 'Solana Mainnet',
    };
}
