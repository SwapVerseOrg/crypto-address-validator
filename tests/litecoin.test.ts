import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Litecoin - Valid addresses', () => {
    const result1 = validate('LM2WMpR1Rp6j3Sa59cMXMs1SPzj9eXpGc1', 'LTC');
    assert.strictEqual(result1.isValid, true);
    assert.strictEqual(result1.network, 'mainnet');

    // SegWit
    const result2 = validate(
        'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kgmn4n9',
        'LTC',
    );
    assert.strictEqual(result2.isValid, true);
});
