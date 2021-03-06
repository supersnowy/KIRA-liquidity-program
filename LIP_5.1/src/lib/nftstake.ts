import { BigNumber, Contract, ethers } from 'ethers';
import { BALANCE, POOL } from 'src/types/nftTypes';

const abi = [
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "contract IERC1155",
        "name": "_nftTokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Stake",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Unstake",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftTokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardPerNFT",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardPeriod",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxPerClaim",
        "type": "uint256"
      }
    ],
    "name": "addPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardSoFar",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "firstStakedAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastClaimedAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct STAKE",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getFirstStakedAtOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      }
    ],
    "name": "getPool",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftTokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalStakes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalRewards",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardPerNFT",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxPerClaim",
            "type": "uint256"
          }
        ],
        "internalType": "struct POOL",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getPool",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftTokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalStakes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalRewards",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardPerNFT",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxPerClaim",
            "type": "uint256"
          }
        ],
        "internalType": "struct POOL",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReservedRewards",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getRewardSoFarOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nftId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getRewards",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      }
    ],
    "name": "getTotalStakes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "notifyRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "rewardOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC1155",
        "name": "_nftTokenAddress",
        "type": "address"
      }
    ],
    "name": "setNftTokenAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "name": "setTokenAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakingPoolsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "totalStakeOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_count",
        "type": "uint256"
      }
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const create = (address: string, provider: any) => {
  const contract = new Contract(address, abi, provider);

  // READ
  // const cards = (id: number) => contract.cards(id).then((val: any) => val);
  const totalStakeOf = (id: number, address: string) => contract.totalStakeOf(id, address).then((val: any) => val.toNumber());
  const rewardOf = (id: number, address: string) => contract.rewardOf(id, address).then((val: any) => ethers.utils.formatUnits(val, 0));
  // const isCardPayable = (id: number) => contract.isCardPayable(id).then((val: any) => val);
  // const rewardedStones = (address: string) =>
  //   contract.rewardedStones(address).then((v: BigNumber) => parseFloat(ethers.utils.formatEther(v)));
  // const farmed = (address: string) =>
  //   contract.farmed(address).then((v: BigNumber) => parseFloat(ethers.utils.formatEther(v)));
  // const minContribution = () => contract.minContribution().then((v: BigNumber) => ethers.utils.formatEther(v));
  // const maxContribution = () => contract.maxContribution().then((v: BigNumber) => ethers.utils.formatEther(v));

  const getPool = (nftId: number, address: string) => 
   contract["getPool(uint256,address)"](nftId, address).
   then((val: BigNumber[]) => ({
     poolId: val[0]?.toNumber() ?? 0,
     nftTokenId: val[1]?.toNumber() ?? 0,
     totalStakes: val[2]?.toNumber() ?? 0,
     totalRewards: val[3]?.toNumber() ?? 0,
     rewardPerNFT: val[4]?.toNumber() ?? 0,
     rewardPeriod: val[5]?.toNumber() ?? 0,
     maxPerClaim: val[6]?.toNumber() ?? 0,
     isUndefined(): boolean {
      return ((val[5]?.toNumber() ?? 0) === 0);
    }} as POOL)
  );

  const getRewards = (nftId: number, address: string) => contract["getRewards(uint256,address)"](nftId, address).then((val: BigNumber) => val);

  const getBalance = (nftId: number, address: string) => 
   contract["getBalance(uint256,address)"](nftId, address).
   then((val: BigNumber[]) =>{
     return getRewards(nftId, address).then((rewardsToClaim: BigNumber) => ({
      nftTokenId: nftId,
      amount: val[0]?.toNumber() ?? 0,
      rewardSoFar: val[1]?.toNumber() ?? 0,
      firstStakedAt: val[2]?.toNumber() ?? 0,
      lastClaimedAt: val[3]?.toNumber() ?? 0,
      rewardsToClaim: rewardsToClaim?.toNumber() ?? 0,
      isUndefined(): boolean {
        return ((val[0]?.toNumber() ?? 0) === 0 && 
          (val[1]?.toNumber() ?? 0) === 0 && 
          (val[2]?.toNumber() ?? 0) === 0 && 
          (val[3]?.toNumber() ?? 0) === 0);
      }} as BALANCE)
    )});
    
  // WRITE
  const stake = (poolId: number, amount: number) => contract.stake(poolId, amount);

  const unstake = (poolId: number, amount: number) => contract.unstake(poolId, amount);

  const claimReward = (poolId: number) => contract.claimReward(poolId);

  return {
    rewardOf,
    totalStakeOf,
    stake,
    unstake,
    claimReward,
    getPool,
    getBalance
  };
};
