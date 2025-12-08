import { ValidationResult } from '../types.js';

/**
 * Validate Tron address
 */
export function validateTron(address: string): ValidationResult {
    // Tron addresses start with T and are 34 characters
    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
        return { isValid: false, network: null, network_name: null };
    }

    // Additional base58check validation could be added

    return { isValid: true, network: 'mainnet', network_name: 'Tron Mainnet' };
}
