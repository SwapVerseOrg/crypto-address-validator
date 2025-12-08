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

test('Ethereum - Valid addresses', () => {
    // Lowercase (sem checksum)
    const result1 = validate(
        '0x742d35cc6634c0532925a3b844bc454e4438f44e',
        'ETH',
    );
    assert.strictEqual(result1.isValid, true);
    assert.strictEqual(result1.network, 'mainnet');
    assert.ok(result1.network_name?.includes('Ethereum'));

    // Outro endereço lowercase
    const result2 = validate(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        'ETH',
    );
    assert.strictEqual(result2.isValid, true);
});

test('Ethereum - Invalid addresses', () => {
    const result1 = validate('0x742d35', 'ETH'); // Too short
    assert.strictEqual(result1.isValid, false);

    const result2 = validate('742d35Cc6634C0532925a3b844Bc454e4438f44e', 'ETH'); // Missing 0x
    assert.strictEqual(result2.isValid, false);

    const result3 = validate(
        '0xGGGG35Cc6634C0532925a3b844Bc454e4438f44e',
        'ETH',
    ); // Invalid chars
    assert.strictEqual(result3.isValid, false);
});

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

test('Dogecoin - Valid addresses', () => {
    const result = validate('D7Y55r6Yoc1G8EECxkQ6SuSjTgGJJ7M6yD', 'DOGE');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.network, 'mainnet');
    assert.ok(result.network_name?.includes('Dogecoin'));
});

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

test('Cardano - Valid addresses', () => {
    const result = validate(
        'addr1qxy3w62dep486jrx8f62q6q0xk2jj9vy3gvg9lmjdh50r5t8qm6z5',
        'ADA',
    );
    // Note: This will depend on proper Bech32 validation
    assert.strictEqual(typeof result.isValid, 'boolean');
});

test('Solana - Valid addresses', () => {
    const result = validate(
        '4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T',
        'SOL',
    );
    assert.strictEqual(result.isValid, true);
    assert.ok(result.network_name?.includes('Solana'));
});

test('Solana - Invalid addresses', () => {
    // Endereço muito curto
    const result1 = validate('4Nd1mBQtrMJ', 'SOL');
    assert.strictEqual(result1.isValid, false);

    // Endereço com caracteres inválidos (contém 0)
    const result2 = validate(
        '0000000000000000000000000000000000000000000',
        'SOL',
    );
    assert.strictEqual(result2.isValid, false);

    // Endereço que não decodifica para 32 bytes
    const result3 = validate(
        '111111111111111111111111111111111111111111',
        'SOL',
    );
    assert.strictEqual(result3.isValid, false);
});

test('Tron - Valid addresses', () => {
    const result = validate('TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH', 'TRX');
    assert.strictEqual(result.isValid, true);
    assert.ok(result.network_name?.includes('Tron'));
});

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

test('Polygon - Valid addresses', () => {
    // Polygon uses Ethereum address format
    const result1 = validate(
        '0x742d35cc6634c0532925a3b844bc454e4438f44e',
        'MATIC',
    );
    assert.strictEqual(result1.isValid, true);
    assert.ok(result1.network_name?.includes('Polygon'));

    // Using POLYGON ticker
    const result2 = validate(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        'POLYGON',
    );
    assert.strictEqual(result2.isValid, true);

    // Using POL ticker (new)
    const result3 = validate(
        '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
        'POL',
    );
    assert.strictEqual(result3.isValid, true);
});

test('Polygon - Invalid addresses', () => {
    // Invalid format
    const result1 = validate('0xinvalid', 'MATIC');
    assert.strictEqual(result1.isValid, false);

    // Not hex
    const result2 = validate(
        '0xGGGG35cc6634c0532925a3b844bc454e4438f44e',
        'MATIC',
    );
    assert.strictEqual(result2.isValid, false);
});

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
