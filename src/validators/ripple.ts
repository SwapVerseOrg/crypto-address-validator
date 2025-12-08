import { ValidationResult } from '../types.js';
import { sha256 } from '../utils/base58.js';
import { rippleBase58Decode } from '../utils/ripple.js';

/**
 * Validate Ripple (XRP) address
 * Ripple uses a custom Base58 alphabet: rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz
 */
export function validateRipple(address: string): ValidationResult {
    // Ripple addresses start with 'r' and are 25-35 characters
    if (
        !address.startsWith('r') ||
        address.length < 25 ||
        address.length > 35
    ) {
        return { isValid: false, network: null, network_name: null };
    }

    // Decode using Ripple's Base58 alphabet
    const decoded = rippleBase58Decode(address);
    if (!decoded || decoded.length < 5) {
        return { isValid: false, network: null, network_name: null };
    }

    // Verify checksum
    const payload = decoded.slice(0, -4);
    const checksum = decoded.slice(-4);

    const hash1 = sha256(payload);
    const hash2 = sha256(hash1);

    const checksumValid = checksum.every((byte, i) => byte === hash2[i]);
    if (!checksumValid) {
        return { isValid: false, network: null, network_name: null };
    }

    // Check version byte (Ripple mainnet uses 0x00)
    const version = decoded[0];
    if (version === 0x00) {
        return {
            isValid: true,
            network: 'mainnet',
            network_name: 'Ripple Mainnet',
        };
    }

    return { isValid: false, network: null, network_name: null };
}
