import NFTAbi from "@/contract/abis/NFT.json";
import NFTExchangeAbi from "@/contract/abis/NftExchagne.json";
import ExchangeOrdersHolderAbi from "@/contract/abis/ExchangeOrdersHolder.json";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { PropsWithChildren, useCallback, useEffect } from "react";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import {
  ExchangeOrdersHolder,
  NFTAddress,
  NftExchange,
  TransferProxy,
} from "@/contract/addresses";
import DAPPService from "@/services/dapp";
import { useRequest } from "ahooks";
import ContractService, { ContractDTO } from "@/services/contract";
import NFTService from "@/services/nft";
import UserService, { CollectionDTO } from "@/services/user";
import OrderService from "@/services/order";
import useToast from "@/hooks/useToast";
import { eth2Wei } from "@/tools/eth-tools";
const UINT256_MAX = "1";

export default function ExamplePage() {
  // useWatchContractEvent({
  //   address: ERC721RaribleFactoryC2Address.sepolia,
  //   abi: ERC721RaribleFactoryC2Abi,
  //   eventName: "Create721RaribleUserProxy",
  //   onLogs(logs) {
  //     const { eventName, transactionHash, data } = logs[0] as any;
  //     if (eventName === "Create721RaribleUserProxy") {
  //       setTokens(updateTokenAddressWithTx(transactionHash, decodeHex(data)));
  //     }
  //   },
  // });

  return (
    <div className="scroll hide-scrollbar" style={{ height: "100%" }}>
      <Box sx={{ px: 2, maxWidth: 500, mx: "auto" }}>
        <Block title="Contracts">
          <Contracts />
        </Block>
        <Block title="My NFTs">
          <MyNFTs />
        </Block>
        <Block title="Listed Orders">
          <ListedOrders />
        </Block>
      </Box>
    </div>
  );
}

function Block(props: PropsWithChildren<{ title: string }>) {
  const { title, children } = props;

  return (
    <Card sx={{ my: 4 }} variant="outlined">
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Contracts() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { data, loading } = useRequest(ContractService.listAll);
  console.log({ data });
  const records = data?.records || [];

  const handleMint = useCallback(
    async (contract: ContractDTO) => {
      if (!address) return;
      const { tokenId, r, s, v } = await DAPPService.signMessage(
        contract.address
      );

      writeContract(
        {
          abi: NFTAbi,
          address: contract.address,
          functionName: "mint",
          args: [
            tokenId,
            v,
            r,
            s,
            [],
            "/ipfs/bafkreiggk6hokdb7iyqvjqerthnimh2tmkdl2xfjxcjei2dl2ku2ouh7fe",
          ],
        },
        {
          onSettled(data, error, variables, context) {
            console.log({ data, error, variables, context });
          },
          onSuccess(data) {
            NFTService.add({
              contractId: contract.id,
              address: contract.address,
              categoryId: 0,
              imgUrl: "abc",
              storageId: 1,
              tokenId,
              locked: true,
              lockedContent: "",
              name: contract.name,
              description: contract.description,
              royalties: "",
              properties: "",
              nftVerify: 0,
              isSync: true,
              creator: address,
              txHash: data,
              animUrl: "",
              animStorageId: 0,
              metadataUrl: "",
              metadataContent: "",
              getMetaTimes: 0,
              // address: contract.address,
            } as any);
          },
        }
      );
    },
    [writeContract, address]
  );

  return (
    <Box>
      {records.map((r) => {
        return (
          <Stack
            key={r.id}
            sx={{
              border: "solid 1px #ccc",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography>
              {r.name}
              <Typography variant="caption">({r.symbol})</Typography>
            </Typography>
            <Typography mb={1} overflow="hidden" textOverflow={"ellipsis"}>
              {r.address}
            </Typography>
            <Button variant="contained" fullWidth onClick={() => handleMint(r)}>
              Mint
            </Button>
          </Stack>
        );
      })}
    </Box>
  );
}

function MyNFTs() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data, loading, run } = useRequest(UserService.collectionList, {
    manual: true,
  });

  useEffect(() => {
    if (address) {
      run({ address });
    }
  }, [address]);

  const toast = useToast();
  const { writeContract, writeContractAsync } = useWriteContract();

  const handleApprove = useCallback((collection: CollectionDTO) => {
    return writeContractAsync({
      abi: NFTAbi,
      address: collection.address,
      functionName: "approve",
      args: [TransferProxy.sepolia, collection.items[0].tokenId],
    });
  }, []);

  const handleSell = useCallback(
    async (collection: CollectionDTO) => {
      console.log("sell ", collection);
      await handleApprove(collection);
      const { r, s, v } = await DAPPService.signMessage(NFTAddress.sepolia);

      const prepareOrderResult = await OrderService.prepare({
        type: "1",
        owner: collection.items[0].itemOwner,
        sellToken: collection.address,
        sellTokenId: collection.items[0].tokenId,
        sellValue: "1",
        sellType: "3",
        buyToken: "0x0000000000000000000000000000000000000000",
        buyTokenId: "0",
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
          address: ExchangeOrdersHolder.sepolia,
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
        }
      );

      console.log({ addOrderResult });
    },
    [address]
  );

  const records = data?.records || [];

  return (
    <Box>
      {records.map((r, i) => {
        const metadata = JSON.parse(r.metadataContent);

        return (
          <Stack
            direction="row"
            key={i}
            sx={{
              border: "solid 1px #ccc",
              borderRadius: 1,
              p: 2,
              mb: 1,
            }}
          >
            <Box
              component="img"
              src={`https://ipfs.io/${metadata.image.split("://")[1]}`}
              flexShrink={0}
              width={100}
              height={100}
              mr={2}
            />
            <Stack flex={1} overflow="hidden">
              <Typography>
                {metadata.name} #{r.tokenId}
              </Typography>
              <Stack direction={"row"} mt="auto" justifyContent="flex-end">
                <Button onClick={() => handleApprove(r)}>Approve</Button>
                <Button onClick={() => handleSell(r)}>Sell</Button>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Box>
  );
}

function ListedOrders() {
  const { address } = useAccount();
  const { data } = useRequest(ContractService.listItems, {
    defaultParams: [
      {
        isSell: true,
        address: "0xf8eb6B50399f7Ca8360D68D9156760B043BD756E",
      },
    ],
  });
  const { writeContract } = useWriteContract();

  const handleBuy = useCallback(
    async (nft: any) => {
      console.log("buy ", nft);
      if (!address) return;
      const buyResult = await OrderService.buy({
        owner: nft.items[0].itemOwner,
        sellToken: nft.address,
        sellTokenId: nft.tokenId,
        salt: "1",
        type: "1",
      });
      console.log(NFTExchangeAbi);
      console.log({ buyResult });
      writeContract(
        {
          abi: NFTExchangeAbi,
          address: NftExchange.sepolia,
          functionName: "exchange",
          value: BigInt(buyResult.buyValue),
          args: [
            [
              [
                buyResult.owner, // owner
                buyResult.salt, // salt
                [buyResult.sellToken, Number(buyResult.sellTokenId), 3], // sellAsset
                [buyResult.buyToken, Number(buyResult.buyTokenId), 0], // buyAsset
              ], // key
              UINT256_MAX, // selling(how much has owner (in wei, or UINT256_MAX if ERC-721))
              buyResult.buyValue, // buying(how much wants owner (in wei, or UINT256_MAX if ERC-721))
              0, // sellerFee
            ], // order
            [0, "0x".padEnd(66, "0"), "0x".padEnd(66, "0")], // sign
            Number(buyResult.buyFee), // buyerFee
            [Number(buyResult.v), buyResult.r, buyResult.s], // buyerFeeSign
            buyResult.sellValue, // amount
            address, // buyer
          ],
        },
        {
          onSettled(...args) {
            console.log(args);
          },
        }
      );
    },
    [address]
  );

  const records = data?.records || [];
  return (
    <Box>
      {records.map((r, i) => {
        const metadata = JSON.parse(r.metadataContent);
        const item = r.items[0];
        return (
          <Stack
            direction="row"
            key={i}
            sx={{
              border: "solid 1px #ccc",
              borderRadius: 1,
              p: 2,
              mb: 1,
            }}
          >
            <Box
              component="img"
              src={`https://ipfs.io/${metadata.image.split("://")[1]}`}
              flexShrink={0}
              width={100}
              height={100}
              mr={2}
            />
            <Stack flex={1} overflow="hidden">
              <Typography>
                {metadata.name} #{r.tokenId}
              </Typography>
              <Typography>
                {item.price}
                {item.paytokenName}
              </Typography>
              <Stack direction={"row"} mt="auto" justifyContent="flex-end">
                <Button onClick={() => handleBuy(r)}>Buy</Button>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Box>
  );
}
