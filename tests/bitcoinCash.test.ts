import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Bitcoin Cash - Valid addresses', () => {
    // CashAddr format
    const result1 = validate(
        'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
        'BCH',
    );
    assert.strictEqual(result1.isValid, true);

    // Without prefix
    const result2 = validate(
        'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
        'BCH',
    );
    assert.strictEqual(result2.isValid, true);
});
