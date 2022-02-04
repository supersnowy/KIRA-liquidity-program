# Kira NFT Staking

LIP_5 is a collection of smart contracts for KEX staking & KIRA NFT farming.

## Install dependencies

Before you begin, check Common Guide's [Dependency Setup Section](../setup.md#1.-Dependency-Setup)

```
yarn
```

## Environmental variables

```
INFURA_PROJECT_ID=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
ACCESS_CONTROL_ADDRESS=
```

- `INFURA_PROJECT_ID`: You can signup on infura.io and can get the project id on settings page.
- `PRIVATE_KEY`: Private key of the deployer account
- `ETHERSCAN_API_KEY`: You can signup on etherscan.io and can get the api key. This key will be used to verify the smart contracts on etherscan.
- `ACCESS_CONTROL_ADDRESS`: Smart contract which manges the roles of accounts for other smart contract
- `NFT_STAKING_ADDRESS`: Smart contract which allows to earn KEX ERC20, for staking KIRA NFT tokens

## Smart contracts

### MockKex

We need to deploy MockKex for testing but we don't need it for production. In production, just use the [ERC20 KEX token address](https://eth.kira.network).

### KiraAccessControl
This is a smart contract which manages the roles of accounts for other smart contracts. There are two roles: `ADMIN` & `MANAGER`. It contains the functions to add/remove roles to account. Deployer is being set as `ADMIN` by default. Only admins can add/remove roles to other accounts.

### KiraNFT

KiraNFT is an ERC1155 NFT smart contract.

`tokenUri`: this is the base url for token metadata of each id.

##### `mint`

Only the owner can mint NFT.

* `address account`: mint NFTs to the address
* `uint256 id`: the token id
* `uint256 amount`: the amount of token

##### `mintBatch`

Only the owner can mint NFT.

* `address account`: mint NFTs to the address
* `uint256[] memory ids`: the token ids
* `uint256[] memory amounts`: the amounts of tokens

##### `addCard`

Only the owner can call `addCard` to set the NFT price and count.

* `uint256 id`: the token id
* `uint24 quantity`: the number of the instance for the token id
* `uint256 amount`: the number of `Crystal` to buy one NFT token for the token id


##### `addCardBatch`

The batch of the `addCard`

##### `setFarmerAddress`

Only the owner can call `setFarmerAddress`. This just updates the farmer (`KexFarm`) contract address for KiraNFT.

##### `buy`

There is a public function that any user can call to buy the NFT with `Crystal`s through the `farmer`. It will decrease the `Crystal`s from user's account on farmer contract. Instead, it mints the NFT to the caller.

* `uint256 id`: the token id
* `uint256 count`: the number of the instance to buy

* IKexFarm farmer

### NFTStaking

Staking ERC1155 and get rewards as ERC20.

##### constructor

* `KiraAccessControl _accessControl`: the AccessControl contract address.

##### `updateAccessControl`

* `KiraAccessControl _accessControl`: only the admin role account can update the AccessControl contract address

##### `addPool`

Only managers (set by AccessControl) can create a pool with the following parameters.

* `uint256 poolId`: the id of a staking pool
* `IERC1155 nftToken`: NFT token contract address (only ERC1155)
* `uint256 nftTokenId`: NFT token id
* `IERC20 rewardToken`: ERC20 reward token address. Users stake their NFTs and will get rewards as this token
* `uint256 rewardPerNFT`: reward amount that user gets when he/she stakes one NFT per 30 days. The reward is calculated based on this parameter and the passed staking time.

##### `addRewards`

Only managers (set by AccessControl) can add reward tokens to staking pools.

* `uint256 poolId`: the id of a staking pool
* `uint256 amount`: the amount of ERC20 reward tokens. This will send the amount of ERC20 tokens from the manager's account to the pool's contract.

##### `withdrawRewards`

Only managers (set by AccessControl) can withdraw reward tokens from staking pools.

* `uint256 poolId`: the id of a staking pool
* `uint256 amount`: the amount of ERC20 reward tokens. This will send the amount of ERC20 tokens from the pool's contract to the manager's account.

##### `stake`

This is a public function that any user can call for staking their NFTs. It transfers the NFT token from user's account to the staking pool.
If the user already staked to this pool, it distributes the current rewards to the user and starts staking from the fresh with the updated NFT token count.

* `uint256 poolId`: the id of a staking pool
* `uint256 count`: the amount of NFT token that user wants to stake. The NFT should be the pool's ERC1155 token & the token id.

##### `unstake`

This is a public function that any user can call for unstaking their NFTs. It transfers the NFT token from the staking pool to the user's account.
It distributes the current rewards to the user and starts staking from the fresh with the updated NFT token count.

* `uint256 poolId`: the id of a staking pool
* `uint256 count`: the amount of NFT token that user wants to unstake. The NFT should be the pool's ERC1155 token & the token id.

##### `claimReward`

This is a public function that any user can call for claiming their staking rewards. It calculates the reward amount based on the passed staking time and the pool's reward speed.

* `uint256 poolId`: the id of a staking pool

The smart contract also contains the view functions to query the current staking pool information.

### KexFarm

This is a smart contract that users can stake their ERC20 token and get `Crystals` which will be used to buy NFTs.

##### `setTokenAddress`

Only the admin can set the ERC20 token address which users will stake.

##### `deposit`

This is a public function that users can call for depositing their ERC20 tokens to stake. It will transfer the ERC20 tokens from the user to the smart contract and update the staking balance for the caller.

* `uint256 amount`: amount of ERC20 token to deposit

##### `withdraw`

This is a public function that users can call for withdrawing their ERC20 tokens to unstake. It will transfer the ERC20 tokens the smart contract to the user and update the staking balance for the caller.

* `uint256 amount`: amount of ERC20 token to withdraw

##### `farmed`

This is a public view function that returns how many KEX has farmed for the certain account

* `address sender`: the account to check the farmed balance

##### `payment`

This is a payment function to buy a NFT using `Crystals` from KiraNFT contract. Only callable from authorized account. We need to add the KiraNFT contract address as authorized.

* `address buyer`: the account to buy NFT using `Crystals`
* `uint256 amount`: `Crystal` amount

##### `rewardedStones`

This is a public function to calculate & update the rewards for an account. The calculation is based on the passed seconds since the last update.

-----

### Deployment guides

##### Deploy & Verify MockKex Contract

```sh
# Once deployed, it will mint `300000000 KEX` on the deployer account for testing purpose.
npx hardhat run scripts/1_deploy_MockKex.js --network kovan
# KEX on RINKEBY: 0xb03a58Df62CD548603685f9E17a337d64AC056E1
# KEX on KOVAN: 0x539fa9544ea8f82a701b6d3c6a6f0e2ebe307ea6
# KEX on MAINNET: 0x16980b3B4a3f9D89E33311B5aa8f80303E5ca4F8

# Save KIRA_TOKEN_ADDRESS as env variable
echo "KIRA_TOKEN_ADDRESS=0x539fa9544ea8f82a701b6d3c6a6f0e2ebe307ea6" >> ./.env && \
 . ./.env

# Verify test KEX address 
npx hardhat verify --network kovan $KIRA_TOKEN_ADDRESS "KIRA Network" "KEX" "300000000000000"
```

##### Deploy & Verify KiraAccessControl Contract

```sh

# Sets a manager role for the deployer address
npx hardhat run scripts/2_deploy_AccessControl.js --network kovan
# KiraAccessControl on RINKEBY: 0x0c9FCeF7F6272d2c1053839b1069b4b5f884D4E3
# KiraAccessControl on KOVAN: 0x8cDC897BCE72Df659096Ef31CdF0a4DDaDCCEA8F
# KiraAccessControl on MAINNET: TBD

# Save ACCESS_CONTROL_ADDRESS as env variable
echo "ACCESS_CONTROL_ADDRESS=0x0c9FCeF7F6272d2c1053839b1069b4b5f884D4E3" >> ./.env && \
 . ./.env

# Verify access control contract
npx hardhat verify --network kovan $ACCESS_CONTROL_ADDRESS
```

##### Deploy & Verify NFTStaking Contract

```sh
# Requires `ACCESS_CONTROL_ADDRESS` set in env variables
npx hardhat run scripts/3_deploy_NFTStaking.js --network kovan
# NFTStaking on RINKEBY: 0x0433c6CB94863850eb3fECE472A482f228F65b2E
# NFTStaking on KOVAN: 0x52510ba27b024199764ad0FD85aca3B8a29801D3
# NFTStaking on MAINNET: TBD

# Save NFT_STAKING_ADDRESS as env variable
echo "NFT_STAKING_ADDRESS=0x0433c6CB94863850eb3fECE472A482f228F65b2E" >> ./.env && \
 . ./.env

# verify NFT staking contract
npx hardhat verify --network kovan $NFT_STAKING_ADDRESS $ACCESS_CONTROL_ADDRESS
```

##### Deploy & Verify KexFarm Contract

```sh
# Requires `KIRA_TOKEN_ADDRESS` set in env variables
npx hardhat run scripts/4_deploy_KexFarm.js --network kovan 
# KexFarm on RINKEBY: 0x995179A0ae6Df352d1f49555fd8C8495D8Bb61B1
# KexFarm on KOVAN: 0x21cfa4a7cD1ECC8e214c0A05457c48680aae548e
# KexFarm on MAINNET: TBD

# Save NFT_FARM_ADDRESS as env variable
echo "NFT_FARM_ADDRESS=0x0c9FCeF7F6272d2c1053839b1069b4b5f884D4E3" >> ./.env && \
 . ./.env

# verify NFT farming contract
npx hardhat verify --network kovan $NFT_FARM_ADDRESS $KIRA_TOKEN_ADDRESS
```

##### Deploy & Verify KiraNFT Mint Contract

```sh
# Sets the `KexFarm` address for `KiraNFT` minter contract
# Requires `NFT_FARM_ADDRESS` set in env variables
npx hardhat run scripts/5_deploy_KiraNFT.js --network kovan
# KiraNFT on RINKEBY: 0xD33269a1eeD3aFBC2a78Ee1c98704580c2AC7Dc1
# KiraNFT on KOVAN: TBD
# KiraNFT on MAINNET: TBD

# Save NFT_MINTING_ADDRESS as env variable
echo "NFT_MINTING_ADDRESS=0xD33269a1eeD3aFBC2a78Ee1c98704580c2AC7Dc1" >> ./.env && \
 . ./.env

# Verify NFT minting contract
npx hardhat verify --network kovan $NFT_MINTING_ADDRESS
```

-----

### Metadata

Metadata is located under `/metadata` directory.

It contains the information (NFT image, description, name, attributes, etc) for each NFT. Currently we have 6 NFTs.

For now, we are uploading to github for NFT images and metadata. We can consider about IPFS for this.

### Testing

##### Add NFT Card Information

With a deployer account, we can add the following information to each NFT. (call `KiraNFT`'s `addCard` function.)
- how many instances are available
- how many Crystals are needed to buy one instance
##### Get NFTs

There are two ways to get NFTs.

- With a deployer account, we can mint NFTs to any accounts for testing purpose.
- We can use KexFarm. To do this, we can send the MockKex tokens to a testing user and then farm Crystals from MockKEX. After getting some Crystals, we can buy NFTs.
##### Add pools (ERC1155 vs ERC20 pair) to NFTStaking

To be able to stake KiraNFT to get MockKex tokens, we need to add pools to each KiraNFT. Currently we have 6 NFT, so need to add 6 pools to NFTStaking.

Check `NFTStaking`'s `addPool` function in the above.