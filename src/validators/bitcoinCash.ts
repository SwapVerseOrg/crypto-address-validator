import { ValidationResult } from '../types.js';
import { base58Decode, verifyBase58Check } from '../utils/base58.js';

/**
 * Validate Bitcoin Cash address (supports both legacy and CashAddr formats)
 */
export function validateBitcoinCash(address: string): ValidationResult {
    // CashAddr format (bitcoincash: or q/p prefix)
    const cashAddrMatch = address.match(/^(bitcoincash:)?([qp][a-z0-9]{41})$/i);
    if (cashAddrMatch) {
        return {
            isValid: true,
            network: 'mainnet',
            network_name: 'Bitcoin Cash Mainnet',
        };
    }

    // Testnet CashAddr
    const testnetMatch = address.match(/^(bchtest:)?([qp][a-z0-9]{41})$/i);
    if (testnetMatch) {
        return {
            isValid: true,
            network: 'testnet',
            network_name: 'Bitcoin Cash Testnet',
        };
    }

    // Legacy format (same as Bitcoin)
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
        if (!verifyBase58Check(address)) {
            return { isValid: false, network: null, network_name: null };
        }

        const decoded = base58Decode(address);
        if (!decoded) {
            return { isValid: false, network: null, network_name: null };
        }

        const version = decoded[0];

        if (version === 0x00 || version === 0x05) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Bitcoin Cash Mainnet (Legacy)',
            };
        }

        if (version === 0x6f || version === 0xc4) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Bitcoin Cash Testnet (Legacy)',
            };
        }
    }

    return { isValid: false, network: null, network_name: null };
}
