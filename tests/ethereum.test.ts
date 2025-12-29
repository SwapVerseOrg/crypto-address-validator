import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Ethereum - Valid addresses', () => {
    // Lowercase (sem checksum)
    const result1 = validate(
        '0x742d35cc6634c0532925a3b844bc454e4438f44e',
        'ETH',
    );
    assert.strictEqual(result1.isValid, true);
    assert.strictEqual(result1.network, 'mainnet');
    assert.ok(result1.network_name?.includes('Ethereum'));

    // Outro endereço lowercase
    const result2 = validate(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        'ETH',
    );
    assert.strictEqual(result2.isValid, true);

    // Endereço com checksum EIP-55
    const result3 = validate(
        '0xfE4bF92DBa94090E64f5EC571182721B7f16d859',
        'ETH',
    );
    assert.strictEqual(result3.isValid, true);
    assert.strictEqual(result3.network, 'mainnet');
    assert.ok(result3.network_name?.includes('Ethereum'));
});

test('Ethereum - Invalid addresses', () => {
    const result1 = validate('0x742d35', 'ETH'); // Too short
    assert.strictEqual(result1.isValid, false);

    const result2 = validate('742d35Cc6634C0532925a3b844Bc454e4438f44e', 'ETH'); // Missing 0x
    assert.strictEqual(result2.isValid, false);

    const result3 = validate(
        '0xGGGG35Cc6634C0532925a3b844Bc454e4438f44e',
        'ETH',
    ); // Invalid chars
    assert.strictEqual(result3.isValid, false);
});
