import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Bitcoin - Valid mainnet addresses', () => {
    // Legacy P2PKH (starts with 1)
    const result1 = validate('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC');
    assert.strictEqual(result1.isValid, true);
    assert.strictEqual(result1.network, 'mainnet');
    assert.ok(result1.network_name?.includes('Bitcoin'));

    // P2SH (starts with 3) - usando endereço válido conhecido
    const result2 = validate('3Nxwenay9Z8Lc9JBiywExpnEFiLp6Afp8v', 'BTC');
    assert.strictEqual(result2.isValid, true);
    assert.strictEqual(result2.network, 'mainnet');

    // Native SegWit (bc1)
    const result3 = validate(
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        'BTC',
    );
    assert.strictEqual(result3.isValid, true);
    assert.strictEqual(result3.network, 'mainnet');

    const result4 = validate(
        'bc1pmfr3p9j00pfxjh0zmgp99y8zftmd3s5pmedqhyptwy6lm87hf5sspknck9',
        'BTC',
    );
    assert.strictEqual(result4.isValid, true);
    assert.strictEqual(result4.network, 'mainnet');
});

test('Bitcoin - Invalid addresses', () => {
    const result1 = validate('invalid-address', 'BTC');
    assert.strictEqual(result1.isValid, false);
    assert.strictEqual(result1.network, null);

    const result2 = validate('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfN', 'BTC'); // Too short
    assert.strictEqual(result2.isValid, false);

    const result3 = validate('', 'BTC');
    assert.strictEqual(result3.isValid, false);
});
