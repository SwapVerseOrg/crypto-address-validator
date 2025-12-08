import { ValidationResult } from '../types.js';
import { verifyEthereumChecksum } from '../utils/ethereum.js';

/**
 * Validate Ethereum address
 */
export function validateEthereum(address: string): ValidationResult {
    // Basic format check
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    // Verify checksum if mixed case
    if (!verifyEthereumChecksum(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    // Ethereum doesn't have separate testnet addresses
    return {
        isValid: true,
        network: 'mainnet',
        network_name: 'Ethereum Mainnet',
    };
}
