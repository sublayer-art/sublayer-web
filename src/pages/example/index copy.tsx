import Center from "@/components/Center";
import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormItem from "@/components/Form/FormItem";
import { ERC721RaribleAbi } from "@/contract/abis/ERC721Rarible";
import { ERC721RaribleFactoryC2Abi } from "@/contract/abis/ERC721RaribleFactoryC2";
import { ERC721RaribleFactoryC2Address } from "@/contract/addresses";
import { truncateString } from "@/tools/string.tools";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useSignMessage,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { Asset, Order, enc, encToken, id } from "./tools";

type TokenData = {
  name: string;
  symbol: string;
  baseURI: string;
  contractURI: string;
  operators: any[];
  salt: any[];
  tx: string;
  address?: Address;
  nfts: string[];
};

const ZERO = "0x0000000000000000000000000000000000000000";
function getTokens(): TokenData[] {
  try {
    return JSON.parse(localStorage.getItem("tokens") || "");
  } catch (error) {
    return [];
  }
}

function saveTokens(tokens: TokenData[]) {
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

function addNFT(nftId: string, token: TokenData) {
  if (!token.address) return;
  const allTokens = getTokens();
  const idx = allTokens.findIndex((t) => t.address === token.address);
  if (idx) {
    token.nfts.push(nftId);
    allTokens[idx] = token;
  }
  saveTokens(allTokens);
}

function updateTokenAddressWithTx(tx: string, address: Address): TokenData[] {
  const allTokens = getTokens();
  const idx = allTokens.findIndex((token) => token.tx === tx);
  if (idx) {
    allTokens[idx].address = address;
  }

  return [...allTokens];
}

function decodeHex(hex: string) {
  return ("0x" + BigInt(hex).toString(16)) as Address;
}

export default function ExamplePage() {
  const [tokens, setTokens] = useState(getTokens);

  useWatchContractEvent({
    address: ERC721RaribleFactoryC2Address.sepolia,
    abi: ERC721RaribleFactoryC2Abi,
    eventName: "Create721RaribleUserProxy",
    onLogs(logs) {
      const { eventName, transactionHash, data } = logs[0] as any;
      if (eventName === "Create721RaribleUserProxy") {
        setTokens(updateTokenAddressWithTx(transactionHash, decodeHex(data)));
      }
    },
  });

  useEffect(() => {
    console.log({ tokens });
    if (tokens && tokens.length) {
      saveTokens(tokens);
    }
  }, [tokens]);

  return (
    <div className="scroll hide-scrollbar" style={{ height: "100%" }}>
      <Box sx={{ px: 2, maxWidth: 500, mx: "auto" }}>
        <Block title="Deploy">
          <Deploy
            onSubmit={(token) => {
              setTokens((oldTokens) => [...oldTokens, token]);
            }}
          />
        </Block>
        <Block title="Deployed Tokens">
          <DeployedTokens tokens={tokens} />
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

function Deploy({ onSubmit }: { onSubmit: (token: TokenData) => void }) {
  const { writeContract } = useWriteContract();

  const [submitting, setSubmitting] = useState(false);
  const createToken = useCallback(
    (formData: any) => {
      setSubmitting(true);
      const args = [
        formData.name,
        formData.symbol,
        formData.baseURI,
        formData.contractURI,
        [], // operators (address[])
        [], // salt (uint256)
      ];
      writeContract(
        {
          abi: ERC721RaribleFactoryC2Abi,
          address: ERC721RaribleFactoryC2Address.sepolia,
          functionName: "createToken",
          args,
        },
        {
          onSettled(data, error, variables, context) {
            setSubmitting(false);
            if (error) {
              alert(error.message);
            }

            if (data) {
              console.log(
                `click https://sepolia.etherscan.io/tx/${data} to see transaction details`
              );
              const token: TokenData = {
                name: formData.name,
                symbol: formData.symbol,
                baseURI: formData.baseURI,
                contractURI: formData.contractURI,
                operators: [],
                salt: [],
                tx: data,
                nfts: [],
              };
              onSubmit(token);
            }
            console.log({ data, error, variables, context });
          },
        }
      );
    },
    [onSubmit, writeContract]
  );

  return (
    <Form
      onSubmit={async (data) => {
        createToken(data);
      }}
      initialValues={{
        baseURI: "ipfs://",
        contractURI: "ipfs://QmQGh5symCyvr5zY91KGMRK4B29uXetLv681Bocaqjpe2D/0",
      }}
    >
      <FormItem label="Name" name="name">
        <FormInput />
      </FormItem>
      <FormItem label="Symbol" name="symbol">
        <FormInput />
      </FormItem>
      <FormItem label="Base URI" name="baseURI">
        <FormInput />
      </FormItem>
      <FormItem label="Contract URI" name="contractURI">
        <FormInput />
      </FormItem>
      <LoadingButton
        loading={submitting}
        type="submit"
        fullWidth
        variant="contained"
      >
        Deploy
      </LoadingButton>
    </Form>
  );
}

function DeployedTokens({ tokens }: { tokens: TokenData[] }) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  function decimalToPaddedBinary(decimal: number, length = 24) {
    // 将十进制数转换为二进制字符串
    let binary = decimal.toString(2);

    // 计算需要添加的零的数量
    const zerosToAdd = length - binary.length - 1;

    // 如果需要添加零，则在字符串前面添加零
    if (zerosToAdd > 0) {
      binary = "b" + "0".repeat(zerosToAdd) + binary;
    }

    return binary;
  }

  const handleMint = useCallback(
    async (token: TokenData) => {
      return new Promise<Address>((resolve, reject) => {
        if (!token.address) {
          return reject("token address error");
        }

        const randomId = Math.round(Math.random() * 100000);
        console.log("随机 randomId:", randomId);
        console.log("参数 tokenId:", address + decimalToPaddedBinary(randomId));

        writeContract(
          {
            abi: ERC721RaribleAbi,
            address: token.address!,
            functionName: "mintAndTransfer",
            args: [
              {
                tokenId: address + decimalToPaddedBinary(randomId),
                tokenURI:
                  "/ipfs/bafkreiggk6hokdb7iyqvjqerthnimh2tmkdl2xfjxcjei2dl2ku2ouh7fe",
                creators: [{ account: address, value: 10000 }],
                royalties: [],
                signatures: [
                  "0x0000000000000000000000000000000000000000000000000000000000000000",
                ],
              },
              address,
            ],
          },
          {
            onSettled(data, error, variables, context) {
              console.log({ data, error, variables, context });
              if (data) {
                const nftId = BigInt(
                  address + decimalToPaddedBinary(randomId)
                ).toString(10);
                console.log("nftId is:", nftId);
                addNFT(nftId, token);
                resolve(data);
              } else {
                reject(error);
              }
            },
          }
        );
      });
    },
    [address, writeContract]
  );

  return (
    <Box>
      {tokens.map((token, index) => {
        return <TokenInfo key={index} token={token} onMint={handleMint} />;
      })}
    </Box>
  );
}

function TokenInfo({
  token,
  onMint,
}: {
  token: TokenData;
  onMint: (token: TokenData) => Promise<Address>;
}) {
  const { address } = useAccount();
  const { signMessage } = useSignMessage();

  const balancInfo = useReadContract({
    abi: ERC721RaribleAbi,
    address: token.address!,
    functionName: "balanceOf",
    args: [address],
  });

  const [mintting, setMintting] = useState(false);

  const handleSell = useCallback(
    async (nft: string) => {
      if (!address) return;
      const _priceSell = 100;
      const erc721TokenId1 = 1000;
      const salt = 1;
      const nftAmount = 1;

      const _nftSellAssetData = encToken(token.address!, erc721TokenId1);
      // const encDataLeft = enc([[], [address, 300], true]);

      const _nftPurchaseAssetData = "0x";
      const ORDER_DATA_V2 = id("V2");
      const makeOrder = Order(
        address,
        Asset(id("ERC721"), _nftSellAssetData, nftAmount),
        ZERO,
        Asset(id("ETH"), _nftPurchaseAssetData, _priceSell),
        salt,
        0,
        0,
        ORDER_DATA_V2,
        // encDataLeft
        _nftSellAssetData
      );

      signMessage(
        {
          message: JSON.stringify(makeOrder),
        },
        {
          onSettled(data, error, variables, context) {
            console.log("sign res:", data, error);
          },
        }
      );
      //   const directPurchaseParams = {
      //     sellOrderMaker: makerLeft,
      //     sellOrderNftAmount: nftAmount,
      //     nftAssetClass: id("ERC721_LAZY"),
      //     nftData: encodedMintData,
      //     sellOrderPaymentAmount: _priceSell,
      //     paymentToken: zeroAddress,
      //     sellOrderSalt: salt,
      //     sellOrderStart: 0,
      //     sellOrderEnd: 0,
      //     sellOrderDataType: ORDER_DATA_V2,
      //     sellOrderData: encDataLeft,
      //     sellOrderSignature: signature,
      //     buyOrderPaymentAmount: _pricePurchase,
      //     buyOrderNftAmount: nftAmount,
      //     buyOrderData: encDataRight,
      //   };
    },
    [address, signMessage, token.address]
  );
  const handleBuy = useCallback(() => {}, []);

  return (
    <Card variant="outlined" sx={{ my: 2 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography>
          {token.symbol}
          <Typography variant="caption">({token.name})</Typography>
        </Typography>
        {token.address ? (
          <Typography
            component="a"
            color="primary"
            mt={2}
            display="block"
            href={`https://sepolia.etherscan.io/address/${token.address!}`}
          >
            {truncateString(token.address!, 20, 8)}
          </Typography>
        ) : (
          <Center>
            <CircularProgress size={20} />
          </Center>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Stack direction="row">
          <Typography>Tokens:</Typography>
          <Typography>
            {Number(balancInfo?.data || 0)}({token.nfts.length})
          </Typography>
        </Stack>
        <LoadingButton
          size="small"
          variant="outlined"
          loading={mintting}
          disabled={!token.address}
          onClick={async () => {
            setMintting(true);
            try {
              const txid = await onMint(token);
              console.log(
                `click https://sepolia.etherscan.io/tx/${txid} to see transaction details`
              );
            } catch (error) {
              console.error(error);
            } finally {
              setMintting(false);
            }
          }}
        >
          Mint
        </LoadingButton>
      </CardActions>
      {token.nfts && token.nfts.length > 0 && (
        <Box sx={{ pb: 2, px: 1 }}>
          {token.nfts.map((nft, index) => {
            return (
              <Box
                key={index}
                sx={{ my: 1, display: "flex", alignItems: "center" }}
              >
                <Typography
                  component="a"
                  color="green"
                  sx={{ flex: 1 }}
                  target="_blank"
                  href={`https://sepolia.etherscan.io/nft/${token.address!}/${nft}`}
                >
                  # {truncateString(nft, 4, 8)}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={() => handleSell(nft)}
                >
                  Sell
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={handleBuy}
                >
                  Buy
                </Button>
              </Box>
            );
          })}
        </Box>
      )}
    </Card>
  );
}
