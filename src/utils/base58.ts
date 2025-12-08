import { createHash } from 'crypto';

/**
 * Base58 character set
 */
const BASE58_ALPHABET =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Decode Base58 string to Uint8Array
 */
export function base58Decode(input: string): Uint8Array | null {
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
 * Verify Base58Check encoding
 */
export function verifyBase58Check(address: string): boolean {
    try {
        const decoded = base58Decode(address);
        if (!decoded || decoded.length < 5) return false;

        const payload = decoded.slice(0, -4);
        const checksum = decoded.slice(-4);

        const hash1 = sha256(payload);
        const hash2 = sha256(hash1);

        return checksum.every((byte, i) => byte === hash2[i]);
    } catch {
        return false;
    }
}

/**
 * SHA-256 hash function using Node.js crypto
 */
export function sha256(data: Uint8Array): Uint8Array {
    const hash = createHash('sha256');
    hash.update(data);
    return new Uint8Array(hash.digest());
}
