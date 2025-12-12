import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Liquid Network - Valid addresses', () => {
    // Legacy P2PKH address (starts with Q, version 0x39)
    const result1 = validate('Q9pKWeozNd9UeY7mADcTDagkPBbzkoBQTy', 'LBTC');
    assert.strictEqual(result1.isValid, true);
    assert.strictEqual(result1.network, 'mainnet');
    assert.ok(result1.network_name?.includes('Liquid'));

    // Confidential address (longer format with Blech32)
    const result2 = validate(
        'lq1qq2uwmm4cpu9ykr0tqdaju2cs3d7kdule67hlpnzrunpnmv083gwegj7hs0ef4zdep909e8lcayp7rx74772z55krja52ez7mx',
        'LBTC',
    );
    assert.strictEqual(result2.isValid, true);
    assert.strictEqual(result2.network, 'mainnet');
    assert.ok(result2.network_name?.includes('Confidential'));

    // Test with LIQUID ticker
    const result3 = validate('Q9pKWeozNd9UeY7mADcTDagkPBbzkoBQTy', 'LIQUID');
    assert.strictEqual(result3.isValid, true);
    assert.strictEqual(result3.network, 'mainnet');
});

test('Liquid Network - Invalid addresses', () => {
    // Invalid format
    const result1 = validate('invalid-liquid-address', 'LBTC');
    assert.strictEqual(result1.isValid, false);

    // Wrong prefix
    const result2 = validate('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', 'LBTC');
    assert.strictEqual(result2.isValid, false);

    // Invalid Blech32 checksum (valid address with "1" appended)
    const result3 = validate(
        'lq1qqtswgrdsryjjndhcwy6rgkpgwpruwvyf93wh3mlvz5klvs9s0p9vtm9camphwtcfpgp2l6p6u5hdh8nazh6e2gkdza987ng851',
        'LBTC',
    );
    assert.strictEqual(result3.isValid, false);
});
