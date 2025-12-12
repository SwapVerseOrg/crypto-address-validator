import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Polkadot - Valid addresses', () => {
    // Valid Polkadot address (starts with 1)
    const result = validate(
        '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        'DOT',
    );
    assert.strictEqual(result.isValid, true);
    assert.ok(result.network_name?.includes('Polkadot'));
});

test('Polkadot - Invalid addresses', () => {
    // Wrong format
    const result1 = validate('invalid-address', 'DOT');
    assert.strictEqual(result1.isValid, false);

    // Wrong length
    const result2 = validate('15oF4uVJwmo4TdGW7VfQxN', 'DOT');
    assert.strictEqual(result2.isValid, false);
});
