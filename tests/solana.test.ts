import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Solana - Valid addresses', () => {
    const result = validate(
        '4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T',
        'SOL',
    );
    assert.strictEqual(result.isValid, true);
    assert.ok(result.network_name?.includes('Solana'));
});

test('Solana - Invalid addresses', () => {
    // Endereço muito curto
    const result1 = validate('4Nd1mBQtrMJ', 'SOL');
    assert.strictEqual(result1.isValid, false);

    // Endereço com caracteres inválidos (contém 0)
    const result2 = validate(
        '0000000000000000000000000000000000000000000',
        'SOL',
    );
    assert.strictEqual(result2.isValid, false);

    // Endereço que não decodifica para 32 bytes
    const result3 = validate(
        '111111111111111111111111111111111111111111',
        'SOL',
    );
    assert.strictEqual(result3.isValid, false);
});
