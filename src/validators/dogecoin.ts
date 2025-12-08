import { ValidationResult } from '../types.js';
import { base58Decode, verifyBase58Check } from '../utils/base58.js';

/**
 * Validate Dogecoin address
 */
export function validateDogecoin(address: string): ValidationResult {
    if (!/^D[5-9A-HJ-NP-U][a-km-zA-HJ-NP-Z1-9]{32}$/.test(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    if (!verifyBase58Check(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    const decoded = base58Decode(address);
    if (!decoded) {
        return { isValid: false, network: null, network_name: null };
    }

    const version = decoded[0];

    // Mainnet
    if (version === 0x1e) {
        return {
            isValid: true,
            network: 'mainnet',
            network_name: 'Dogecoin Mainnet',
        };
    }

    // Testnet
    if (version === 0x71) {
        return {
            isValid: true,
            network: 'testnet',
            network_name: 'Dogecoin Testnet',
        };
    }

    return { isValid: false, network: null, network_name: null };
}
