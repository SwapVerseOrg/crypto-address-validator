import { ValidationResult } from './types.js';
import { validateBitcoin } from './validators/bitcoin.js';
import { validateBitcoinCash } from './validators/bitcoinCash.js';
import { validateCardano } from './validators/cardano.js';
import { validateDogecoin } from './validators/dogecoin.js';
import { validateEthereum } from './validators/ethereum.js';
import { validateLitecoin } from './validators/litecoin.js';
import { validateLiquid } from './validators/liquid.js';
import { validatePolkadot } from './validators/polkadot.js';
import { validatePolygon } from './validators/polygon.js';
import { validateRipple } from './validators/ripple.js';
import { validateSolana } from './validators/solana.js';
import { validateTron } from './validators/tron.js';

/**
 * Network to validator mapping
 * Maps network identifiers to their respective validation functions
 */
const NETWORK_VALIDATORS: Record<
    string,
    (address: string) => ValidationResult
> = {
    // Bitcoin Network
    BTC: validateBitcoin,
    BITCOIN: validateBitcoin,

    // Ethereum Network (EVM compatible)
    ETH: validateEthereum,
    ETHEREUM: validateEthereum,
    ERC20: validateEthereum,
    BSC: validateEthereum,
    BNB: validateEthereum,
    AVAX: validateEthereum,
    AVAXC: validateEthereum,
    BASE: validateEthereum,
    OPTIMISM: validateEthereum,
    OP: validateEthereum,
    ARBITRUM: validateEthereum,
    ARB: validateEthereum,

    // Polygon Network (EVM compatible)
    MATIC: validatePolygon,
    POLYGON: validatePolygon,
    POL: validatePolygon,

    // Litecoin Network
    LTC: validateLitecoin,
    LITECOIN: validateLitecoin,

    // Liquid Network
    LBTC: validateLiquid,
    LIQUID: validateLiquid,

    // Dogecoin Network
    DOGE: validateDogecoin,
    DOGECOIN: validateDogecoin,

    // Ripple Network (XRP Ledger)
    XRP: validateRipple,
    RIPPLE: validateRipple,
    XRPL: validateRipple,

    // Cardano Network
    ADA: validateCardano,
    CARDANO: validateCardano,

    // Solana Network
    SOL: validateSolana,
    SOLANA: validateSolana,
    SPL: validateSolana,

    // Tron Network
    TRX: validateTron,
    TRON: validateTron,
    TRC20: validateTron,

    // Bitcoin Cash Network
    BCH: validateBitcoinCash,
    BITCOINCASH: validateBitcoinCash,

    // Polkadot Network
    DOT: validatePolkadot,
    POLKADOT: validatePolkadot,
};

/**
 * Validate a cryptocurrency address for a specific network
 *
 * @param address - The cryptocurrency address to validate
 * @param network - The blockchain network identifier (e.g., 'BTC', 'ETH', 'POLYGON', 'SOLANA')
 * @returns ValidationResult object with isValid, network type (mainnet/testnet), and network_name
 *
 * @example
 * ```typescript
 * // Validate Bitcoin address
 * const result = validate('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC');
 * console.log(result);
 * // { isValid: true, network: 'mainnet', network_name: 'Bitcoin Mainnet' }
 *
 * // Validate USDT on Ethereum network
 * const usdtEth = validate('0x742d35cc6634c0532925a3b844bc454e4438f44e', 'ETH');
 *
 * // Validate USDT on Solana network
 * const usdtSol = validate('4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T', 'SOL');
 *
 * // Validate USDT on Polygon network
 * const usdtPoly = validate('0x742d35cc6634c0532925a3b844bc454e4438f44e', 'POLYGON');
 * ```
 */
export function validate(address: string, network: string): ValidationResult {
    if (!address || typeof address !== 'string') {
        return { isValid: false, network: null, network_name: null };
    }

    if (!network || typeof network !== 'string') {
        return { isValid: false, network: null, network_name: null };
    }

    const normalizedNetwork = network.toUpperCase().trim();
    const validator = NETWORK_VALIDATORS[normalizedNetwork];

    if (!validator) {
        return { isValid: false, network: null, network_name: null };
    }

    try {
        return validator(address.trim());
    } catch (error) {
        return { isValid: false, network: null, network_name: null };
    }
}

/**
 * Get list of supported blockchain networks
 */
export function getSupportedNetworks(): string[] {
    return Object.keys(NETWORK_VALIDATORS)
        .filter((key) => key.length <= 7) // Filter out long aliases
        .sort();
}

// Export types
export type { NetworkType, ValidationResult } from './types.js';
