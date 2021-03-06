import { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { providers as EthersProviders } from 'ethers';
import { create as createERC20 } from '../lib/erc20';
import { create as createERC1155 } from '../lib/erc1155';
import { create as createStakingPool } from '../lib/farm';
import { create as createNFTStaking } from '../lib/nftstake';
import { NFT_FARM_ADDRESS, KIRA_TOKEN_ADDRESS, NFT_MINTING_ADDRESS, NFT_STAKING_ADDRESS, INFURA_NETWORK, INFURA_PROJECT_ID } from 'src/config';

export function useContracts() {
  const { ethereum }: { ethereum: any } = useWallet();
  const ethers = useMemo(() => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null), [ethereum]);

  const signer = ethers ? ethers.getSigner() : null;  

  const token = createERC20(KIRA_TOKEN_ADDRESS, signer);

  const nft = createERC1155(
    NFT_MINTING_ADDRESS,
    signer ? signer : new EthersProviders.InfuraProvider(INFURA_NETWORK, INFURA_PROJECT_ID),
  );

  const stakingPool = createStakingPool(NFT_FARM_ADDRESS, signer);

  const nftStaking = createNFTStaking(NFT_STAKING_ADDRESS, signer);

  // TODO: DEBUG ONLY, REMOVE FOR MAINNET
  // console.log("useContracts.ts => useContracts()")
  // console.log({ signer: signer, token: KIRA_TOKEN_ADDRESS, nft: NFT_MINTING_ADDRESS, stakingPool: NFT_FARM_ADDRESS, nftStaking: NFT_STAKING_ADDRESS  })

  return { ethers, token, nft, stakingPool, nftStaking };
}
