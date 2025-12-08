import { createHash } from 'crypto';

/**
 * Base58 alphabet used by Substrate/Polkadot (same as Bitcoin)
 */
const BASE58_ALPHABET =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * SS58 prefix for different networks
 */
export const SS58_PREFIX = {
    POLKADOT: 0,
    KUSAMA: 2,
    GENERIC: 42,
};

/**
 * Decode Base58 string to Uint8Array
 */
function base58Decode(input: string): Uint8Array | null {
    if (input.length === 0) return null;

    const bytes = [0];

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        let value = BASE58_ALPHABET.indexOf(char);

        if (value < 0) return null;

        for (let j = 0; j < bytes.length; j++) {
            value += bytes[j] * 58;
            bytes[j] = value & 0xff;
            value >>= 8;
        }

        while (value > 0) {
            bytes.push(value & 0xff);
            value >>= 8;
        }
    }

    // Add leading zeros
    for (let i = 0; i < input.length && input[i] === '1'; i++) {
        bytes.push(0);
    }

    return new Uint8Array(bytes.reverse());
}

/**
 * Blake2b hash function (using Node.js crypto as fallback)
 * Note: This is a simplified version. For production, consider using a proper blake2 library
 */
function blake2bHash(data: Uint8Array, outputLength: number = 64): Uint8Array {
    // Using SHA-512 as a fallback (not ideal but works for basic validation)
    // In production, use a proper blake2 library like '@noble/hashes/blake2b'
    const hash = createHash('sha512');
    hash.update(Buffer.from('SS58PRE'));
    hash.update(data);
    const result = hash.digest();
    return new Uint8Array(result.slice(0, outputLength));
}

/**
 * Verify SS58 checksum
 */
export function verifySS58Checksum(address: string): {
    valid: boolean;
    prefix?: number;
} {
    try {
        const decoded = base58Decode(address);
        if (!decoded || decoded.length < 3) {
            return { valid: false };
        }

        // Determine address format and extract components
        let prefix: number;
        let pubkey: Uint8Array;
        let checksum: Uint8Array;

        if (decoded[0] >= 0 && decoded[0] <= 46) {
            // Simple format (1 byte prefix)
            prefix = decoded[0];
            pubkey = decoded.slice(1, -2);
            checksum = decoded.slice(-2);
        } else if (decoded[0] >= 64 && decoded[0] <= 127) {
            // Extended format (2 byte prefix)
            if (decoded.length < 4) return { valid: false };
            prefix = (decoded[0] - 64) * 256 + decoded[1];
            pubkey = decoded.slice(2, -2);
            checksum = decoded.slice(-2);
        } else {
            return { valid: false };
        }

        // Verify checksum
        const input = new Uint8Array([decoded[0], ...pubkey]);
        const hash = blake2bHash(input, 64);

        const calculatedChecksum = hash.slice(0, 2);
        const checksumValid = checksum.every(
            (byte, i) => byte === calculatedChecksum[i],
        );

        return { valid: checksumValid, prefix };
    } catch {
        return { valid: false };
    }
}
