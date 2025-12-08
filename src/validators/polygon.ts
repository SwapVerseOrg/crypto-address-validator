import { ValidationResult } from '../types.js';
import { verifyEthereumChecksum } from '../utils/ethereum.js';

/**
 * Validate Polygon (MATIC) address
 * Polygon uses the same address format as Ethereum (EVM compatible)
 */
export function validatePolygon(address: string): ValidationResult {
    // Polygon addresses are identical to Ethereum addresses (EVM compatible)
    // Basic format check
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    // Verify checksum if mixed case
    if (!verifyEthereumChecksum(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    // Polygon doesn't have separate testnet addresses
    return {
        isValid: true,
        network: 'mainnet',
        network_name: 'Polygon Mainnet',
    };
}
