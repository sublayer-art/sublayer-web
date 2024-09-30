import Center from "@/components/Center";
import Form from "@/components/Form";
import { ContractItemDTO, ContractItemMetaData } from "@/services/contract";
import OrderService from "@/services/order";
import { viewAddressUrl } from "@/tools/btc";
import { UINT256_MAX, wei2Eth } from "@/tools/eth-tools";
import { truncateString } from "@/tools/string.tools";
import { LoadingButton } from "@mui/lab";

import NFTExchangeAbi from "@/contract/abis/NftExchagne.json";
import { NftExchange } from "@/contract/addresses";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useAccount, useWriteContract } from "wagmi";
import useToast from "@/hooks/useToast";

export interface OrderModelRef {
  show: (data: any) => void;
}
type OrderModelProps = {
  onSuccess: VoidFunction;
};

const OrderModel = forwardRef<OrderModelRef, OrderModelProps>(
  ({ onSuccess }, ref) => {
    const [data, setData] = useState<ContractItemDTO>();
    const { address } = useAccount();

    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        async show(data) {
          if (!address) {
            return;
          }

          setData(data);
          setIsOpen(true);
        },
      }),
      [address]
    );
    const handleClose = () => {
      setIsOpen(false);
    };
    const initState = () => {
      setData(undefined);
    };
    const toast = useToast();

    const [submitting, setSubmitting] = useState(false);

    const { item, itemOwner, metadata } = useMemo(() => {
      if (data) {
        const item = data?.items[0];
        const itemOwner = item?.itemOwner;
        const metadata: ContractItemMetaData = JSON.parse(
          data?.metadataContent
        );
        return { item, itemOwner, metadata };
      }
      return {};
    }, [data]);

    const { writeContract } = useWriteContract();
    const handleBuy = useCallback(
      async (nft: any) => {
        if (!address) return;
        setSubmitting(true);
        try {
          const buyResult = await OrderService.buy({
            owner: nft.items[0].itemOwner,
            sellToken: nft.address,
            sellTokenId: nft.tokenId,
            salt: "1",
            type: "1",
          });
          writeContract(
            {
              abi: NFTExchangeAbi,
              address: NftExchange.darwinia,
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
              onSuccess() {
                toast.success("buy successful");
                setIsOpen(false);
              },
              onSettled(...args) {
                setSubmitting(false);
                console.log({ ...args });
                onSuccess?.();
              },
            }
          );
        } catch (error) {
          console.error(error);

          setSubmitting(false);
        }
      },
      [address, onSuccess, writeContract]
    );

    return (
      <Dialog
        open={isOpen}
        closeAfterTransition
        fullWidth
        sx={{
          ".MuiPaper-root": {
            maxWidth: 720,
          },
        }}
        // onClose={handleClose}
        TransitionProps={{
          onExited() {
            initState();
          },
        }}
      >
        <DialogTitle>Create Buy Order</DialogTitle>
        <DialogContent>
          {data ? (
            <Stack>
              <Box
                component="ul"
                sx={{
                  width: "100%",
                  px: 2,
                  mx: "auto",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 1,

                  li: {
                    overflow: "hidden",
                    my: 1,

                    ".label": {
                      flexShrink: 0,
                      mr: 2,
                    },
                  },
                }}
              >
                <Stack
                  component="li"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography className="label">Goods Name</Typography>
                  <Typography color="gray">{metadata?.name}</Typography>
                </Stack>
                <Stack
                  component="li"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography className="label">Goods Owner</Typography>
                  <Tooltip placement="top" arrow title={itemOwner}>
                    <Typography
                      component="a"
                      href={viewAddressUrl(itemOwner ?? "")}
                      target="_blank"
                      color="gray"
                      sx={{ cursor: "pointer" }}
                    >
                      {truncateString(itemOwner ?? "")}
                    </Typography>
                  </Tooltip>
                </Stack>

                <Stack
                  component="li"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography className="label">Price</Typography>
                  <Typography color="gray">
                    {wei2Eth(item?.price)} RING
                  </Typography>
                </Stack>
                <Stack
                  component="li"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Service Fee</Typography>
                  <Typography color="gray">0 RING</Typography>
                </Stack>
                <Stack
                  component="li"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Total</Typography>
                  <Typography color="gray">
                    {wei2Eth(item?.price)} RING
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Form
                  onSubmit={async () => {
                    handleBuy(data);
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="center"
                    gap={3}
                    sx={{
                      my: 2,
                      button: {
                        minWidth: 200,
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={submitting}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>

                    <LoadingButton
                      loading={submitting}
                      variant="contained"
                      type="submit"
                    >
                      Buy
                    </LoadingButton>
                  </Stack>
                </Form>
              </Box>
            </Stack>
          ) : (
            <Center>
              <CircularProgress />
            </Center>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

export default OrderModel;
