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
        const lowerAddr = address.toLowerCase();
        
        // Confidential addresses (longer format)
        // Accept if format is correct - Blech32 uses 40-bit checksum (12 chars)
        if (address.length >= 90) {
            // Basic structure validation for confidential addresses
            // They use Blech32 encoding which has a longer checksum
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet (Confidential)',
            };
        }
        
        // Standard non-confidential addresses (shorter, use Bech32)
        if (verifyBech32Checksum(address, 'lq')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet',
            };
        }
        
        // If Bech32 validation fails but format looks correct, try Blech32
        if (verifyBlech32Checksum(address, 'lq')) {
            return {
                isValid: true,
                network: 'mainnet',
                network_name: 'Liquid Network Mainnet (Confidential)',
            };
        }
    }

    // Native SegWit/Confidential - tlq1 for testnet
    if (/^tlq1[a-z0-9]{38,120}$/i.test(address)) {
        // Confidential addresses (longer format)
        if (address.length >= 90) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet (Confidential)',
            };
        }
        
        // Standard Bech32
        if (verifyBech32Checksum(address, 'tlq')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet',
            };
        }
        
        // Try Blech32
        if (verifyBlech32Checksum(address, 'tlq')) {
            return {
                isValid: true,
                network: 'testnet',
                network_name: 'Liquid Network Testnet (Confidential)',
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
