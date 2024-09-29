import Center from "@/components/Center";
import Empty from "@/components/Empty";
import ResponsiveGrid from "@/components/ResponsiveGrid";
import { Box, Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
import CollectionItem from "./CollectionItem";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRequest } from "ahooks";
import UserService, { CollectionDTO } from "@/services/user";
import useToast from "@/hooks/useToast";

import NFTAbi from "@/contract/abis/NFT.json";
import ExchangeOrdersHolderAbi from "@/contract/abis/ExchangeOrdersHolder.json";
import {
  ExchangeOrdersHolder,
  NFTAddress,
  TransferProxy,
} from "@/contract/addresses";
import DAPPService from "@/services/dapp";
import OrderService from "@/services/order";
import { UINT256_MAX, eth2Wei } from "@/tools/eth-tools";

const Collections: React.FC = () => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const { signMessageAsync } = useSignMessage();

  const { data, loading, run, refresh } = useRequest(
    UserService.collectionList,
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (address) {
      run({ address });
    }
  }, [address]);

  const toast = useToast();
  const { writeContract, writeContractAsync } = useWriteContract();

  const handleApprove = useCallback(
    (collection: CollectionDTO) => {
      return writeContractAsync({
        abi: NFTAbi,
        address: collection.address,
        functionName: "approve",
        args: [TransferProxy.darwinia, collection.items[0].tokenId],
      });
    },
    [writeContractAsync]
  );

  const handleSell = useCallback(
    async (collection: CollectionDTO) => {
      console.log("sell ", collection);
      try {
        await handleApprove(collection);
        const { r, s, v } = await DAPPService.signMessage(NFTAddress.darwinia);

        const prepareOrderResult = await OrderService.prepare({
          type: "1",
          owner: collection.items[0].itemOwner,
          sellToken: collection.address,
          sellTokenId: collection.items[0].tokenId,
          sellValue: "1",
          sellType: "3",
          buyToken: "0x0000000000000000000000000000000000000000",
          buyTokenId: "1",
          buyValue: eth2Wei(0.01),
          buyType: "0",
          salt: "1",
          nftItemsId: collection.items[0].tokenId,
          quantity: 1,
          r,
          s,
          v,
        });
        const message = "sign message";
        const signature = await signMessageAsync({ account: address, message });
        const addOrderResult = await OrderService.add({
          ...prepareOrderResult,
          signature,
          message,
        });
        console.log("prepareOrderResult:", prepareOrderResult);

        writeContract(
          {
            abi: ExchangeOrdersHolderAbi,
            address: ExchangeOrdersHolder.darwinia,
            functionName: "add",
            args: [
              [
                [
                  prepareOrderResult.owner, // owner
                  prepareOrderResult.salt, // salt
                  [
                    prepareOrderResult.sellToken,
                    prepareOrderResult.sellTokenId,
                    prepareOrderResult.sellType,
                  ], // sellAsset
                  [
                    prepareOrderResult.buyToken,
                    prepareOrderResult.buyTokenId,
                    prepareOrderResult.buyType,
                  ], // buyAsset
                ], // key
                UINT256_MAX, // selling(how much has owner (in wei, or UINT256_MAX if ERC-721))
                prepareOrderResult.buyValue, // buying(how much wants owner (in wei, or UINT256_MAX if ERC-721))
                0, // sellerFee
              ], // order
            ],
          },
          {
            onSettled(data, error, variables) {
              console.log(data, error, variables);
            },
            onSuccess() {
              toast.success("上架成功");
            },
            onError(error) {
              toast.error(error.message);
            },
          }
        );

        console.log({ addOrderResult });
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [address, handleApprove, signMessageAsync, toast, writeContract]
  );

  const records = data?.records || [];

  return useMemo(() => {
    if (!address) {
      return (
        <Center sx={{ height: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => open({ view: "Connect" })}
          >
            CONNECT WALLET
          </Button>
        </Center>
      );
    }
    if (records.length === 0) {
      return (
        <>
          {loading && (
            <Center>
              <CircularProgress size={32} />
            </Center>
          )}
          <div
            style={{
              display: loading ? "none" : "block",
            }}
          >
            <Empty
              extra={
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={refresh}
                >
                  Refresh
                </Button>
              }
            />
          </div>
        </>
      );
    }
    return (
      <ResponsiveGrid
        itemWidth={200}
        itemsCount={records.length}
        itemBuilder={(index) => {
          const item = records[index];
          return <CollectionItem data={item} onList={() => handleSell(item)} />;
        }}
        hasMore={false}
        loadingIndicator={
          <Box sx={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                aspectRatio: 0.95,
                width: "100%",
                height: "auto",
                position: "relative",
              }}
            >
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
            <Skeleton width="100%" sx={{ my: 1 }} />
            <Stack direction="row" justifyContent="space-between">
              <Skeleton width="40%" />
              <Skeleton width="20%" />
            </Stack>
          </Box>
        }
      />
    );
  }, [address, handleSell, loading, open, records, refresh]);
};
export default Collections;
