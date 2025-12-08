import { ValidationResult } from '../types.js';
import { verifyBech32Checksum } from '../utils/bech32.js';

/**
 * Validate Cardano address
 */
export function validateCardano(address: string): ValidationResult {
    // Shelley addresses (addr1)
    if (/^addr1[a-z0-9]{53,}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'addr')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Cardano Mainnet',
            };
        }
    }

    // Testnet addresses (addr_test1)
    if (/^addr_test1[a-z0-9]{53,}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'addr_test')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Cardano Testnet',
            };
        }
    }

    // Byron-era addresses (legacy, starts with Ae2 or DdzFF)
    if (/^(Ae2|DdzFF)[1-9A-HJ-NP-Za-km-z]{50,}$/.test(address)) {
        return {
            isValid: true,
            network: 'mainnet',
            network_name: 'Cardano Mainnet (Byron)',
        };
    }

    return { isValid: false, network: null, network_name: null };
}
