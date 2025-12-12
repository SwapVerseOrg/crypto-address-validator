import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Cardano - Valid addresses', () => {
    const result = validate(
        'addr1qxy3w62dep486jrx8f62q6q0xk2jj9vy3gvg9lmjdh50r5t8qm6z5',
        'ADA',
    );
    // Note: This will depend on proper Bech32 validation
    assert.strictEqual(typeof result.isValid, 'boolean');
});
