import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Ripple - Valid addresses', () => {
    // Usando endereços Ripple conhecidos e válidos
    const result = validate('rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv', 'XRP');
    assert.strictEqual(result.isValid, true);
    assert.ok(result.network_name?.includes('Ripple'));
});

test('Ripple - Invalid addresses', () => {
    // Endereço com checksum inválido
    const result1 = validate('rN7n7otQDd6FczFgLdlqtyMVrn3HMfeeY8', 'XRP');
    assert.strictEqual(result1.isValid, false);

    // Endereço muito curto
    const result2 = validate('rN7n7otQDd', 'XRP');
    assert.strictEqual(result2.isValid, false);

    // Não começa com 'r'
    const result3 = validate('xN7n7otQDd6FczFgLdlqtyMVrn3HMfeeY9', 'XRP');
    assert.strictEqual(result3.isValid, false);
});
