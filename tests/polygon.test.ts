import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Polygon - Valid addresses', () => {
    // Polygon uses Ethereum address format
    const result1 = validate(
        '0x742d35cc6634c0532925a3b844bc454e4438f44e',
        'MATIC',
    );
    assert.strictEqual(result1.isValid, true);
    assert.ok(result1.network_name?.includes('Polygon'));

    // Using POLYGON ticker
    const result2 = validate(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        'POLYGON',
    );
    assert.strictEqual(result2.isValid, true);

    // Using POL ticker (new)
    const result3 = validate(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        'POL',
    );
    assert.strictEqual(result3.isValid, true);
});

test('Polygon - Invalid addresses', () => {
    // Invalid format
    const result1 = validate('0xinvalid', 'MATIC');
    assert.strictEqual(result1.isValid, false);

    // Not hex
    const result2 = validate(
        '0xGGGG35cc6634c0532925a3b844bc454e4438f44e',
        'MATIC',
    );
    assert.strictEqual(result2.isValid, false);
});
