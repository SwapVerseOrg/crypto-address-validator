/**
 * Bech32 character set
 */
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

/**
 * Bech32 generator values
 */
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

/**
 * Blech32 generator values (used for Liquid confidential addresses)
 * Blech32 uses a 40-bit checksum instead of 30-bit
 */
const BLECH32_GENERATOR = [
    0x7f77850b5,
    0x5f5c7c5a9,
    0x6e6e0a819,
    0x2b5432f1f,
    0x169199f87,
];

/**
 * Polymod for Bech32 checksum
 */
function polymod(values: number[]): number {
    let chk = 1;
    for (const value of values) {
        const top = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ value;
        for (let i = 0; i < 5; i++) {
            if ((top >> i) & 1) {
                chk ^= GENERATOR[i];
            }
        }
    }
    return chk;
}

/**
 * Polymod for Blech32 checksum (Liquid Network confidential addresses)
 */
function polymodBlech32(values: number[]): number {
    let chk = 1;
    for (const value of values) {
        const top = chk >> 35;
        chk = ((chk & 0x7ffffffff) << 5) ^ value;
        for (let i = 0; i < 5; i++) {
            if ((top >> i) & 1) {
                chk ^= BLECH32_GENERATOR[i];
            }
        }
    }
    return chk;
}

/**
 * Expand HRP for Bech32
 */
function hrpExpand(hrp: string): number[] {
    const result: number[] = [];
    for (let i = 0; i < hrp.length; i++) {
        result.push(hrp.charCodeAt(i) >> 5);
    }
    result.push(0);
    for (let i = 0; i < hrp.length; i++) {
        result.push(hrp.charCodeAt(i) & 31);
    }
    return result;
}

/**
 * Bech32 and Bech32m encoding constants
 */
const BECH32_CONST = 1;
const BECH32M_CONST = 0x2bc830a3;

/**
 * Verify Bech32 checksum
 */
export function verifyBech32Checksum(
    address: string,
    expectedHrp: string,
): boolean {
    try {
        const lowerAddress = address.toLowerCase();
        const pos = lowerAddress.lastIndexOf('1');

        if (
            pos < 1 ||
            pos + 7 > lowerAddress.length ||
            lowerAddress.length > 90
        ) {
            return false;
        }

        const hrp = lowerAddress.substring(0, pos);
        if (hrp !== expectedHrp) return false;

        const data: number[] = [];
        for (let i = pos + 1; i < lowerAddress.length; i++) {
            const char = lowerAddress[i];
            const value = CHARSET.indexOf(char);
            if (value === -1) return false;
            data.push(value);
        }

        const values = hrpExpand(hrp).concat(data);
        return polymod(values) === BECH32_CONST;
    } catch {
        return false;
    }
}

/**
 * Verify Bech32m checksum (used for Taproot addresses)
 */
export function verifyBech32mChecksum(
    address: string,
    expectedHrp: string,
): boolean {
    try {
        const lowerAddress = address.toLowerCase();
        const pos = lowerAddress.lastIndexOf('1');

        if (
            pos < 1 ||
            pos + 7 > lowerAddress.length ||
            lowerAddress.length > 90
        ) {
            return false;
        }

        const hrp = lowerAddress.substring(0, pos);
        if (hrp !== expectedHrp) return false;

        const data: number[] = [];
        for (let i = pos + 1; i < lowerAddress.length; i++) {
            const char = lowerAddress[i];
            const value = CHARSET.indexOf(char);
            if (value === -1) return false;
            data.push(value);
        }

        const values = hrpExpand(hrp).concat(data);
        return polymod(values) === BECH32M_CONST;
    } catch {
        return false;
    }
}

/**
 * Verify Blech32 checksum (used for Liquid Network confidential addresses)
 * Blech32 uses a longer checksum (12 characters) and different polymod
 */
export function verifyBlech32Checksum(
    address: string,
    expectedHrp: string,
): boolean {
    try {
        const lowerAddress = address.toLowerCase();
        const pos = lowerAddress.lastIndexOf('1');

        if (
            pos < 1 ||
            pos + 13 > lowerAddress.length || // Blech32 has 12-char checksum
            lowerAddress.length > 1000 // Confidential addresses can be very long
        ) {
            return false;
        }

        const hrp = lowerAddress.substring(0, pos);
        if (hrp !== expectedHrp) return false;

        const data: number[] = [];
        for (let i = pos + 1; i < lowerAddress.length; i++) {
            const char = lowerAddress[i];
            const value = CHARSET.indexOf(char);
            if (value === -1) return false;
            data.push(value);
        }

        const values = hrpExpand(hrp).concat(data);
        return polymodBlech32(values) === 1;
    } catch {
        return false;
    }
}

/**
 * Decode Bech32 address
 */
export function bech32Decode(
    address: string,
): { hrp: string; data: number[] } | null {
    try {
        const lowerAddress = address.toLowerCase();
        const pos = lowerAddress.lastIndexOf('1');

        if (
            pos < 1 ||
            pos + 7 > lowerAddress.length ||
            lowerAddress.length > 90
        ) {
            return null;
        }

        const hrp = lowerAddress.substring(0, pos);
        const data: number[] = [];

        for (let i = pos + 1; i < lowerAddress.length; i++) {
            const char = lowerAddress[i];
            const value = CHARSET.indexOf(char);
            if (value === -1) return null;
            data.push(value);
        }

        const values = hrpExpand(hrp).concat(data);
        if (polymod(values) !== 1) return null;

        return { hrp, data: data.slice(0, -6) };
    } catch {
        return null;
    }
}
