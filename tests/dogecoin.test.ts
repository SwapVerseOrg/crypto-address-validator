import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Dogecoin - Valid addresses', () => {
    const result = validate('D7Y55r6Yoc1G8EECxkQ6SuSjTgGJJ7M6yD', 'DOGE');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.network, 'mainnet');
    assert.ok(result.network_name?.includes('Dogecoin'));
});
