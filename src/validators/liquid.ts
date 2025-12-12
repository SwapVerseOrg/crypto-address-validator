import { ValidationResult } from '../types.js';
import { base58Decode, verifyBase58Check } from '../utils/base58.js';
import {
    verifyBech32Checksum,
    verifyBlech32Checksum,
} from '../utils/bech32.js';

/**
 * Validate Liquid Network address
 * Liquid supports both legacy base58 addresses and native SegWit (Bech32)
 * Liquid also supports Confidential Addresses which are longer
 */
/**
 * Validate Liquid Network address
 * Liquid supports:
 * - Legacy base58 addresses (with Base58Check)
 * - Native SegWit (Bech32) 
 * - Confidential addresses (longer format with Blech32)
 * 
 * Confidential transactions obscure amounts, making address validation crucial
 */
export function validateLiquid(address: string): ValidationResult {
    // Native SegWit/Confidential - lq1 for mainnet
    // Standard addresses: ~42-90 chars (Bech32)
    // Confidential addresses: ~90-120 chars (Blech32 - longer checksum)
    if (/^lq1[a-z0-9]{38,120}$/i.test(address)) {
        // Try Blech32 first (for confidential addresses - longer format)
        if (verifyBlech32Checksum(address, 'lq')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet (Confidential)',
            };
        }
        
        // Try standard Bech32 (for non-confidential addresses)
        if (verifyBech32Checksum(address, 'lq')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet',
            };
        }
    }

    // Native SegWit/Confidential - tlq1 for testnet
    if (/^tlq1[a-z0-9]{38,120}$/i.test(address)) {
        // Try Blech32 first
        if (verifyBlech32Checksum(address, 'tlq')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet (Confidential)',
            };
        }
        
        // Try standard Bech32
        if (verifyBech32Checksum(address, 'tlq')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet',
            };
        }
    }

    // Confidential addresses are base58 encoded and start with specific prefixes
    // Mainnet confidential P2PKH starts with "VJ" (version bytes 0x0B, 0x4C)
    // Mainnet confidential P2SH starts with "VT" (version bytes 0x0B, 0x57)
    if (/^VJ[a-km-zA-HJ-NP-Z1-9]{77,}$/.test(address)) {
        if (verifyBase58Check(address)) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet (Confidential)',
            };
        }
    }

    if (/^VT[a-km-zA-HJ-NP-Z1-9]{77,}$/.test(address)) {
        if (verifyBase58Check(address)) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet (Confidential)',
            };
        }
    }

    // Testnet confidential addresses start with "CTEp" or "CTET"
    if (/^CTEp[a-km-zA-HJ-NP-Z1-9]{74,}$/.test(address)) {
        if (verifyBase58Check(address)) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet (Confidential)',
            };
        }
    }

    if (/^CTET[a-km-zA-HJ-NP-Z1-9]{74,}$/.test(address)) {
        if (verifyBase58Check(address)) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet (Confidential)',
            };
        }
    }

    // Legacy non-confidential addresses
    // Mainnet P2PKH starts with "Q" (version byte 0x39 = 57)
    if (/^Q[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
        if (!verifyBase58Check(address)) {
            return { isValid: false, network: null, network_name: null };
        }

        const decoded = base58Decode(address);
        if (!decoded || decoded.length < 21) {
            return { isValid: false, network: null, network_name: null };
        }

        const version = decoded[0];
        if (version === 0x39) {
            // 57 decimal
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet',
            };
        }
    }

    // Mainnet P2SH starts with "H" (version byte 0x27 = 39)
    if (/^H[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
        if (!verifyBase58Check(address)) {
            return { isValid: false, network: null, network_name: null };
        }

        const decoded = base58Decode(address);
        if (!decoded || decoded.length < 21) {
            return { isValid: false, network: null, network_name: null };
        }

        const version = decoded[0];
        if (version === 0x27) {
            // 39 decimal
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet',
            };
        }
    }

    return { isValid: false, network: null, network_name: null };
}
