import { ValidationResult } from '../types.js';
import { base58Decode, verifyBase58Check } from '../utils/base58.js';
import { verifyBech32Checksum } from '../utils/bech32.js';

/**
 * Validate Litecoin address
 */
export function validateLitecoin(address: string): ValidationResult {
    // Legacy addresses
    if (/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address)) {
        if (!verifyBase58Check(address)) {
            return { isValid: false, network: null, network_name: null };
        }

        const decoded = base58Decode(address);
        if (!decoded) {
            return { isValid: false, network: null, network_name: null };
        }

        const version = decoded[0];

        // Mainnet P2PKH (starts with L)
        if (version === 0x30) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Litecoin Mainnet',
            };
        }

        // Mainnet P2SH (starts with M or 3)
        if (version === 0x32 || version === 0x05) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Litecoin Mainnet',
            };
        }

        // Testnet
        if (version === 0x6f || version === 0xc4) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Litecoin Testnet',
            };
        }
    }

    // Native SegWit (Bech32) - ltc1 for mainnet
    if (/^ltc1[a-z0-9]{39,87}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'ltc')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Litecoin Mainnet (SegWit)',
            };
        }
    }

    // Testnet SegWit
    if (/^tltc1[a-z0-9]{39,87}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'tltc')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Litecoin Testnet (SegWit)',
            };
        }
    }

    return { isValid: false, network: null, network_name: null };
}
