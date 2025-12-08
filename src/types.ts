/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    network: 'mainnet' | 'testnet' | null;
    network_name: string | null;
}

/**
 * Network type enum
 */
export type NetworkType = 'mainnet' | 'testnet';
