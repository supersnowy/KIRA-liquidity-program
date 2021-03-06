/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { useToast } from '@chakra-ui/toast';
import { useEffect, useState } from 'react';
import { NFT_STAKING_ADDRESS } from 'src/config';
import { useContracts } from 'src/hooks/useContracts';
import { Card, POOL } from 'src/types/nftTypes';
import { QueryDataTypes } from 'src/types/queryDataTypes';
import { useWallet } from 'use-wallet';
import { OutlinedButton, PrimaryButton } from '../ui';

type StakeNFTModalProps = {
  isOpen?: boolean;
  onClose: () => any;
  data: QueryDataTypes;
  card: Card;
  pool: POOL;
  reloadMyCollection: () => any;
};

const StakeNFTModal = ({ isOpen = false, onClose, data, card, pool, reloadMyCollection }: StakeNFTModalProps) => {
  
  const nftId = pool.nftTokenId;
  const [value, setValue] = useState<number | undefined>(undefined);

  const { nftStaking, nft } = useContracts();
  const { account } = useWallet();
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean | undefined>(false);
  const toast = useToast();

  async function updateInfo(id: number) {
    if (account) {
      const approved = await nft.isApprovedForAll(account, NFT_STAKING_ADDRESS);
      setApproved(approved);

      const balance = await nft.balanceOf(account, id);
      setBalance(balance);
    }
  }

  async function loadApproved() {
    if (account) {
      const approved = await nft.isApprovedForAll(account, NFT_STAKING_ADDRESS);
      setApproved(approved);
    }
  }

  useEffect(() => {
    if (account && isOpen) {
      setApproved(undefined);
      setBalance(undefined);
      updateInfo(nftId);
    }
  }, [isOpen, nftId]);


  const onUseAll = () => {
    setValue(balance ?? 0);
  };

  const onInputChange = (e: any) => {
    const v = parseFloat(e.target.value);
    setValue(isNaN(v) || v < 0 ? undefined : v);
  };

  const ready = balance !== undefined && approved !== undefined && !!value && value <= balance;
  const invalidInput = value !== undefined && balance !== undefined && (value > balance || value === 0);
  const enableApprove = value !== undefined && approved !== undefined && ready && approved === false;
  const enableConfirm = value !== undefined && approved !== undefined && ready && approved === true;

  const onStake = async () => {
    if (value !== undefined && balance !== undefined && value <= balance && value > 0) {
      setLoading(true);
      try {
        const txStake = await nftStaking.stake(pool.poolId, value);
        toast({
          title: 'Pending Transaction',
          description: `Staking ${value} NFT${value > 1 ? 's' : ''} (Id: ${nftId})`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        await txStake.wait();
        toast({
          title: 'Transaction Done',
          description: `Staked ${value} NFT${value > 1 ? 's' : ''} (Id: ${nftId})`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        onClose();
        reloadMyCollection();
      } catch (e: any) {
        toast({
          title: 'Transaction Failed',
          description: e.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error(e);
      }
      setLoading(false);
    }
  };

  const onApprove = async () => {
    setLoading(true);
    try {
      const txApprove = await nft.setApprovalForAll(NFT_STAKING_ADDRESS, true);
      toast({
        title: 'Pending Transaction',
        description: 'Approving NFT',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      await txApprove.wait();
      toast({
        title: 'Transaction Done',
        description: `Approved NFT`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadApproved();
    } catch (e: any) {
      toast({
        title: 'Transaction Failed',
        description: e.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(e);
    }
    setLoading(false);
  };
//<Text color="blue.dark">{`${card?.getName()} | ${card?.getRarity()} NFT`}</Text>
  return (
    <Modal autoFocus blockScrollOnMount isOpen={isOpen} colorScheme="blue" onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalHeader color="gray.secondary" px="48px" pt="48px" pb="24px" fontSize="24px" lineHeight="33.6px">
          Staking Pool | ID: {pool?.poolId ?? "???"}
        </ModalHeader>
        <ModalHeader color="gray.secondary" px="48px" pt="0px" pb="24px" fontSize="18px" lineHeight="0px">
          <Text color="blue.dark">{`${card?.getName()} | ${card?.getRarity()} NFT`}</Text>
        </ModalHeader>
       
        <ModalBody px="48px" py="0px">
          <Flex alignItems="center" direction="row" mb="12px">
            <Text mr="8px" fontSize="16px" lineHeight="26.24px" color="blue.dark">
              Your Balance:
            </Text>
            {balance === undefined && <Button isLoading variant="ghost" width="fit-content" />}
            {balance !== undefined && (
              <Text fontSize="16px" lineHeight="26.24px" color="blue.dark">
                {balance}
              </Text>
            )}
          </Flex>

          <FormControl>
          <Flex
            bg="gray.septenary"
            height="46px"
            px="24px"
            py="12px"
            direction="row"
            alignItems="center"
            borderRadius="8px"
            borderColor={invalidInput ? 'red.300' : 'none'}
            borderWidth="1px"
          >
            <Input
                variant="unstyled"
                size="md"
                color="gray.secondary"
                fontSize="16px"
                lineHeight="26.24px"
                type="number"
                value={value === undefined ? '' : value}
                onChange={onInputChange}
              />
            <Text color="gray.quaternary" fontSize="16px" minWidth="135px">
              QUANTITY
            </Text>
            <Button
                color="white"
                bg="gray.quaternary"
                borderRadius="4px"
                mr="8px"
                w="77px"
                h="30px"
                fontSize="12px"
                _hover={{ boxShadow: '0 0 8px rgb(41 142 255 / 80%)' }}
                onClick={onUseAll}
              >
                MAX
              </Button>
            
              
            
          </Flex>
          </FormControl>
          {/* <Flex alignItems="center" direction="row" mt="10px">
            <Text fontSize="16px" lineHeight="26.24px" color="gray.secondary" mr="8px">
              Remaining NFTs:
            </Text>
            {nRemain === undefined && <Button isLoading variant="ghost" color="blue.dark" width="fit-content" height="16px" />}
            {nRemain !== undefined && (
              <Text fontSize="16px" lineHeight="26.24px" color="blue.dark">
                {nRemain}
              </Text>
            )}
          </Flex> */}
        </ModalBody>

        <ModalFooter px="48px" pt="32px" pb="48px">
          <Flex alignItems="center" justifyContent="space-around" direction="row" w="100%">
            <OutlinedButton
              text="CANCEL"
              onClick={onClose}
              rest={{
                width: '170px',
                height: '48px',
                color: 'gray.tertiary',
                borderWidth: '1px',
                _before: {
                  content: '""',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  borderRadius: '6px',
                  padding: '1px',
                  background: 'linear-gradient(to right, #298DFF, #344AE6)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude',
                },
              }}
            />
            {/* <PrimaryButton text="CONFIRM" onClick={onStake} rest={{ width: '170px', height: '48px', isLoading: loading }} /> */}
            {enableApprove && (
              <PrimaryButton
                text="APPROVE NFT"
                onClick={onApprove}
                rest={{ width: '170px', height: '48px', isLoading: loading, disabled: loading, loadingText: 'APPROVING' }}
              />
            )}
            {!enableApprove && (
              <PrimaryButton
                text="CONFIRM"
                onClick={onStake}
                rest={{ width: '170px', height: '48px', disabled: !enableConfirm || loading, isLoading: loading, loadingText: 'CONFIRM' }}
              />
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StakeNFTModal;
