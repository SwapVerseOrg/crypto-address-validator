import assert from 'node:assert';
import { test } from 'node:test';
import { validate } from '../src/index.js';

test('Invalid network identifier', () => {
    const result = validate('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'INVALID');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.network, null);
    assert.strictEqual(result.network_name, null);
});

test('Empty inputs', () => {
    const result1 = validate('', 'BTC');
    assert.strictEqual(result1.isValid, false);

    const result2 = validate('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', '');
    assert.strictEqual(result2.isValid, false);
});

test('Network aliases work correctly', () => {
    const ethAddress = '0x742d35cc6634c0532925a3b844bc454e4438f44e';

    // Ethereum aliases
    const eth1 = validate(ethAddress, 'ETH');
    const eth2 = validate(ethAddress, 'ETHEREUM');
    const eth3 = validate(ethAddress, 'ERC20');
    assert.strictEqual(eth1.isValid, true);
    assert.strictEqual(eth2.isValid, true);
    assert.strictEqual(eth3.isValid, true);

    // Ethereum aliases
    const bsc1 = validate(ethAddress, 'BSC');
    const bsc2 = validate(ethAddress, 'BNB');
    assert.strictEqual(bsc1.isValid, true);
    assert.strictEqual(bsc2.isValid, true);

    // Polygon aliases
    const poly1 = validate(ethAddress, 'POLYGON');
    const poly2 = validate(ethAddress, 'MATIC');
    const poly3 = validate(ethAddress, 'POL');
    assert.strictEqual(poly1.isValid, true);
    assert.strictEqual(poly2.isValid, true);
    assert.strictEqual(poly3.isValid, true);

    const solAddress = '4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T';

    // Solana aliases
    const sol1 = validate(solAddress, 'SOL');
    const sol2 = validate(solAddress, 'SOLANA');
    const sol3 = validate(solAddress, 'SPL');
    assert.strictEqual(sol1.isValid, true);
    assert.strictEqual(sol2.isValid, true);
    assert.strictEqual(sol3.isValid, true);
});
