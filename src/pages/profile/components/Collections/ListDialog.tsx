import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { btcToSat } from "@/tools/btc";
import MarketService from "@/services/market";
import { forwardRef, useImperativeHandle, useState } from "react";
import { LoadingButton } from "@mui/lab";
import PSBTService from "@/services/psbt";
import useToast from "@/hooks/useToast";
import { defaultExceptionHandler } from "@/tools/error";
import { useAccount } from "wagmi";

export interface ListAction {
  list: (item: any) => void;
}

const ListDialog = forwardRef<ListAction>((_, ref) => {
  const { address } = useAccount();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<any>();
  const [submitting, setSubmitting] = useState(false);

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

  if (!address) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        sx: { minWidth: 400 },
        onSubmit: async (event: any) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const price = Number(formJson.price);
          const sats = btcToSat(price);
          try {
            setSubmitting(true);
            const psbtBase64 = await PSBTService.createListPSBT({
              inscriptionOutput: item.output,
              price: sats,
              sellerAddress: address,
            });

            console.log({ psbtBase64 });

            const signedStr = await window.unisat.signPsbt(psbtBase64);
            console.log({ signedStr });
            const signedPsbtBase64 = await PSBTService.submitSignedPSBT(
              signedStr
            );
            console.log({ signedPsbtBase64 });
            await MarketService.list({
              goodsItemNo: item.inscriptionId,
              goodsItemPrice: sats,
              psbt: signedPsbtBase64,
            });
            toast.success("Listed successfully");
            setSubmitting(false);
            onClose();
          } catch (e) {
            defaultExceptionHandler(e);
            setSubmitting(false);
          }
        },
      }}
    >
      <DialogTitle>List Inscription</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton type="submit" loading={submitting}>
          List
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
});

export default ListDialog;
