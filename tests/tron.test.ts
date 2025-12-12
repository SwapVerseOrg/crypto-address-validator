import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Tron - Valid addresses', () => {
    const result = validate('TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH', 'TRX');
    assert.strictEqual(result.isValid, true);
    assert.ok(result.network_name?.includes('Tron'));
});
