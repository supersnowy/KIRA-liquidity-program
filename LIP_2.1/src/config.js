require('dotenv/config')

const config = {
    KEX_CONTRACT: process.env.KEX_CONTRACT || '0x41379EF961492a594F91bB0F966c2CeD32B49544',
    LOCKING_CONTRACT: process.env.LOCKING_CONTRACT || '0xFE41590843b6E98D482eA725407bB3A910d776A0',
    WETH_CONTRACT: process.env.WETH_CONTRACT || '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    LP_CONTRACT: process.env.LP_CONTRACT || '0xb88b44f171d6fc4ef6efce313819067e62002d5c',
}

export default config;
