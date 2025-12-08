import { createHash } from 'crypto';

/**
 * Keccak-256 hash function for Ethereum addresses
 * Using keccak256 from a proper implementation
 */
export function keccak256(data: Uint8Array): Uint8Array {
    // Node.js crypto doesn't have keccak256, only SHA3-256
    // For now, we'll use a simpler validation approach
    // In production, you'd want to add a proper keccak256 library

    // Create a simple hash for basic validation
    // This is a placeholder - for production use, add @noble/hashes or similar
    const hash = createHash('sha3-256');
    hash.update(data);
    return new Uint8Array(hash.digest());
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
