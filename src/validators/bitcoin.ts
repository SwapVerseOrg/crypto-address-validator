import { ValidationResult } from '../types.js';
import { base58Decode, verifyBase58Check } from '../utils/base58.js';
import { verifyBech32Checksum } from '../utils/bech32.js';

/**
 * Validate Bitcoin address
 */
export function validateBitcoin(address: string): ValidationResult {
    // Legacy addresses (P2PKH and P2SH)
    if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
        if (!verifyBase58Check(address)) {
            return { isValid: false, network: null, network_name: null };
        }

        const decoded = base58Decode(address);
        if (!decoded) {
            return { isValid: false, network: null, network_name: null };
        }

        const version = decoded[0];

        // Mainnet P2PKH (starts with 1)
        if (version === 0x00) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Bitcoin Mainnet',
            };
        }

        // Mainnet P2SH (starts with 3)
        if (version === 0x05) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Bitcoin Mainnet',
            };
        }

        // Testnet P2PKH
        if (version === 0x6f) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Bitcoin Testnet',
            };
        }

        // Testnet P2SH
        if (version === 0xc4) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Bitcoin Testnet',
            };
        }
    }

    // Native SegWit (Bech32) - bc1q for mainnet (P2WPKH/P2WSH)
    if (/^bc1q[a-z0-9]{38,58}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'bc')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Bitcoin Mainnet (SegWit)',
            };
        }
    }

    // Taproot (Bech32m) - bc1p for mainnet (P2TR)
    if (/^bc1p[a-z0-9]{58}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'bc')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Bitcoin Mainnet (Taproot)',
            };
        }
    }

    // Native SegWit (Bech32) - tb1q for testnet (P2WPKH/P2WSH)
    if (/^tb1q[a-z0-9]{38,58}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'tb')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Bitcoin Testnet (SegWit)',
            };
        }
    }

    // Taproot (Bech32m) - tb1p for testnet (P2TR)
    if (/^tb1p[a-z0-9]{58}$/i.test(address)) {
        if (verifyBech32Checksum(address, 'tb')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Bitcoin Testnet (Taproot)',
            };
        }
    }

    return { isValid: false, network: null, network_name: null };
}
