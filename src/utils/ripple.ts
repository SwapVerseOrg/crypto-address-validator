import { sha256 } from './base58.js';

/**
 * Ripple's Base58 alphabet (different from Bitcoin's)
 */
const RIPPLE_ALPHABET =
    'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';

/**
 * Decode Ripple Base58 string to Uint8Array
 */
export function rippleBase58Decode(input: string): Uint8Array | null {
    if (input.length === 0) return null;

    const bytes = [0];

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        let value = RIPPLE_ALPHABET.indexOf(char);

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

    // Add leading zeros (r is the first character in Ripple alphabet, maps to 0)
    for (let i = 0; i < input.length && input[i] === 'r'; i++) {
        bytes.push(0);
    }

    return new Uint8Array(bytes.reverse());
}

/**
 * Verify Ripple Base58Check encoding
 */
export function verifyRippleBase58Check(address: string): boolean {
    try {
        const decoded = rippleBase58Decode(address);
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
