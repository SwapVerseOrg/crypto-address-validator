# Crypto Address Validator

A lightweight and comprehensive JavaScript/TypeScript library for validating cryptocurrency addresses with checksum verification.

## Features

- ✅ Validates format and checksum for cryptocurrency addresses
- 🚀 Zero dependencies (pure JavaScript implementation)
- 📦 ESM module support
- 💪 TypeScript support with full type definitions
- 🔄 Mainnet and testnet detection

## Supported Networks

- **Bitcoin (BTC)** - Legacy, P2SH, SegWit, Taproot
- **Ethereum (ETH)** - EIP-55 checksum validation (EVM compatible)
- **Polygon (POLYGON, MATIC, POL)** - EVM compatible
- **Solana (SOL)** - Ed25519 public key validation
- **Tron (TRX)** - Base58Check addresses
- **Ripple (XRP)** - Custom Base58 alphabet
- **Bitcoin Cash (BCH)** - CashAddr and Legacy
- **Litecoin (LTC)** - Legacy and SegWit
- **Liquid Network (LBTC, LIQUID)** - Sidechain with Confidential Transactions
- **Cardano (ADA)** - Shelley and Byron
- **Dogecoin (DOGE)** - Standard addresses
- **Polkadot (DOT)** - SS58 format

## Installation

```bash
npm install @swapverse/crypto-address-validator
```

## Usage

```javascript
import { validate } from '@swapverse/crypto-address-validator';

// Bitcoin
const btc = validate('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC');
console.log(btc);
// Output: { isValid: true, network: 'mainnet', network_name: 'Bitcoin Mainnet' }

// Ethereum
const eth = validate('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'ETH');
console.log(eth);
// Output: { isValid: true, network: 'mainnet', network_name: 'Ethereum Mainnet' }

// Solana
const sol = validate('4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T', 'SOL');
console.log(sol);
// Output: { isValid: true, network: 'mainnet', network_name: 'Solana Mainnet' }

// Liquid Network
const lbtc = validate('H8JgLKDq5KHdKzFbHzfYAy5YrZvF3LZXE9', 'LBTC');
console.log(lbtc);
// Output: { isValid: true, network: 'mainnet', network_name: 'Liquid Network Mainnet' }

// Invalid address
const invalid = validate('invalid-address', 'BTC');
console.log(invalid);
// Output: { isValid: false, network: null, network_name: null }
```

## API

### `validate(address: string, network: string): ValidationResult`

Validates a cryptocurrency address for a specific network.

**Parameters:**

- `address` - The address to validate
- `network` - Network identifier (e.g., 'BTC', 'ETH', 'SOL', 'POLYGON')

**Returns:**

```typescript
{
    isValid: boolean;
    network: 'mainnet' | 'testnet' | null;
    network_name: string | null;
}
```

### `getSupportedNetworks(): string[]`

Returns an array of all supported network identifiers.

```javascript
import { getSupportedNetworks } from '@swapverse/crypto-address-validator';

const networks = getSupportedNetworks();
console.log(networks);
// Output: ['BTC', 'BITCOIN', 'ETH', 'ETHEREUM', 'POLYGON', 'MATIC', 'SOL', ...]
```

## License

MIT License - feel free to use in your projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
