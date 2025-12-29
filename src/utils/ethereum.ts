import { keccak_256 } from '@noble/hashes/sha3.js';

/**
 * Keccak-256 hash function for Ethereum addresses
 * Using keccak256 from @noble/hashes
 */
export function keccak256(data: Uint8Array): Uint8Array {
    return keccak_256(data);
}

/**
 * Verify Ethereum address checksum (EIP-55)
 */
export function verifyEthereumChecksum(address: string): boolean {
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;

    const addr = address.slice(2);
    const lowerAddr = addr.toLowerCase();

    // If all lowercase or all uppercase, checksum not required
    if (addr === lowerAddr || addr === addr.toUpperCase()) {
        return true;
    }

    const hash = keccak256(new TextEncoder().encode(lowerAddr));

    for (let i = 0; i < 40; i++) {
        const hashByte = hash[Math.floor(i / 2)];
        const hashNibble = i % 2 === 0 ? hashByte >> 4 : hashByte & 0x0f;
        const char = addr[i];

        if (hashNibble >= 8) {
            if (char !== char.toUpperCase()) return false;
        } else {
            if (char !== char.toLowerCase()) return false;
        }
    }

    return true;
}
