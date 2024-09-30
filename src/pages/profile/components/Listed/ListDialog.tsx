import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { LoadingButton } from "@mui/lab";
import useToast from "@/hooks/useToast";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";

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

export interface ListAction {
  list: (item: any) => void;
}

const ListDialog = forwardRef<ListAction>((_, ref) => {
  const { address } = useAccount();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<any>();
  const [submitting, setSubmitting] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const onClose = () => setOpen(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        list(item) {
          setItem(item);
          setOpen(true);
        },
      };
    },
    []
  );

  const { writeContract, writeContractAsync } = useWriteContract();
  const handleApprove = useCallback(() => {
    if (!item) return;
    return writeContractAsync({
      abi: NFTAbi,
      address: item.address,
      functionName: "approve",
      args: [TransferProxy.darwinia, item.tokenId],
    });
  }, [item]);
  const handleSell = useCallback(
    async (price: number) => {
      if (!item) return;
      try {
        setSubmitting(true);
        await handleApprove();
        const { r, s, v } = await DAPPService.signMessage(NFTAddress.darwinia);

        const prepareOrderResult = await OrderService.prepare({
          type: "1",
          owner: item.items[0].itemOwner,
          sellToken: item.address,
          sellTokenId: item.items[0].tokenId,
          sellValue: "1",
          sellType: "3",
          buyToken: "0x0000000000000000000000000000000000000000",
          buyTokenId: "1",
          buyValue: eth2Wei(price),
          buyType: "0",
          salt: "1",
          nftItemsId: item.items[0].tokenId,
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
        console.error(error);

        toast.error((error as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, item, signMessageAsync, toast, writeContract]
  );

  if (!address || !item) return null;
  const metadata = JSON.parse(item.metadataContent);
  return (
    <Dialog
      open={open}
      onClose={(_, r) => {
        if (r === "backdropClick") {
          if (submitting) return;
        }
        onClose();
      }}
      disableEscapeKeyDown={submitting}
      maxWidth="xs"
      PaperProps={{
        component: "form",
        sx: { minWidth: 400 },
        onSubmit: async (event: any) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const price = Number(formJson.price);

          handleSell(price);
        },
      }}
    >
      <DialogTitle>
        List {metadata.name} #{item.tokenId}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          id="price"
          name="price"
          label="Price"
          variant="standard"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <LoadingButton type="submit" loading={submitting}>
          List
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
});

export default ListDialog;
