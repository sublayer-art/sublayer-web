import Center from "@/components/Center";
import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormItem from "@/components/Form/FormItem";
import { ERC721RaribleAbi } from "@/contract/abis/ERC721Rarible";
import { ERC721TokenAddress } from "@/contract/addresses";
import useRecommendedFeeRate from "@/hooks/useFeeRate";
import useToast from "@/hooks/useToast";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export interface MintRef {
  mint: (data: any) => void;
}

type MintFormModalProps = {
  onSuccess: VoidFunction;
};

const MintFormModal = forwardRef<MintRef, MintFormModalProps>(
  ({ onSuccess }, ref) => {
    const toast = useToast();
    const { address } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    const balancInfo = useReadContract({
      abi: ERC721RaribleAbi,
      address: ERC721TokenAddress.sepolia[0],
      functionName: "balanceOf",
      args: [address],
    });
    console.log({ balancInfo });
    const { writeContract } = useWriteContract();
    const [data, setData] = useState<any>();
    const { feeRates } = useRecommendedFeeRate();
    const [currentFeeRate, setCurrentFeeRate] = useState<string>("minimumFee");

    useImperativeHandle(
      ref,
      () => ({
        async mint(data) {
          setData(data);
          setIsOpen(true);
        },
      }),
      []
    );

    console.log(data);
    const handleClose = () => {
      setIsOpen(false);
    };

    const initState = () => {
      setData(undefined);
      setCurrentFeeRate("minimumFee");
    };

    const inscribeContent = `{"p":"unifi","op":"mint","tick":"${data?.goodsName}","amt":"1"}`;
    const [submitting, setSubmitting] = useState(false);

    const handleMint = useCallback(
      (address: string) => {
        console.log("mint ", address);
        writeContract(
          {
            abi: ERC721RaribleAbi,
            address: ERC721TokenAddress.sepolia[0],
            functionName: "mintAndTransfer",
            args: [
              {
                tokenId: address + "b00000000000000000000001",
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
            onError(error, variables, context) {
              console.log({ error, variables, context });
            },
            onSuccess(data, variables, context) {
              console.log({ data, variables, context });
            },
            onSettled(data, error, variables, context) {
              console.log({ data, error, variables, context });
            },
          }
        );
      },
      [writeContract]
    );

    const InscribePreview = (
      <Box
        component="pre"
        sx={{
          p: 2,
          backgroundColor: "#000",
          borderRadius: 2,
        }}
      >
        {inscribeContent}
      </Box>
    );

    return (
      <Dialog
        open={isOpen}
        closeAfterTransition
        fullWidth
        sx={{
          ".MuiPaper-root": {
            maxWidth: 760,
          },
        }}
        TransitionProps={{
          onExited() {
            initState();
          },
        }}
      >
        <DialogTitle>Mint unifi</DialogTitle>
        <DialogContent>
          <Stack>
            <Typography fontSize="1.2rem" fontWeight="bold" textAlign="center">
              Please double check your text below before continuing:
            </Typography>
            <Typography color="secondary" textAlign="center" mt={1}>
              You are about to inscribe 1 unifi.
            </Typography>
            {InscribePreview}
          </Stack>

          <Box>
            <Form
              onSubmit={async ({ address }) => {
                handleMint(address);
              }}
              initialValues={{
                address: address || "",
                // amount: "",
              }}
            >
              <FormItem label="Receive Address" name="address" required>
                <FormInput placeholder="Provide the address to receive the inscription" />
              </FormItem>
              <Box>
                <Typography mb={1}>
                  Select the network fee you want to pay:
                </Typography>
                {feeRates && (
                  <Stack direction="row" gap={2}>
                    <FeeRateSelectItem
                      label="Economy"
                      value={feeRates.economyFee}
                      active={currentFeeRate === "economyFee"}
                      onClick={() => {
                        setCurrentFeeRate("economyFee");
                      }}
                    />
                    <FeeRateSelectItem
                      label="Minimum"
                      value={feeRates.minimumFee}
                      active={currentFeeRate === "minimumFee"}
                      onClick={() => {
                        setCurrentFeeRate("minimumFee");
                      }}
                    />
                    <FeeRateSelectItem
                      label="Fastest"
                      value={feeRates.fastestFee}
                      active={currentFeeRate === "fastestFee"}
                      onClick={() => {
                        setCurrentFeeRate("fastestFee");
                      }}
                    />
                  </Stack>
                )}
              </Box>

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
                  sx={{
                    minWidth: 300,
                  }}
                >
                  Mint
                </LoadingButton>
              </Stack>
            </Form>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
);
export default MintFormModal;

function FeeRateSelectItem(props: {
  active: boolean;
  value: number;
  label: string;
  onClick: VoidFunction;
}) {
  const { active, value, label, onClick } = props;
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        flex: 1,
        borderRadius: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderStyle: "solid",
        borderColor: active ? "secondary.main" : "transparent",
        borderWidth: 1,
        transition: "all 200ms ease",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.3)",
        },
      }}
    >
      <Center>
        <Typography>{label}</Typography>
        <Typography>
          <Typography
            variant="caption"
            fontSize="1rem"
            fontWeight="bold"
            mx={1}
            color="secondary"
          >
            {value}
          </Typography>
          sats/vB
        </Typography>
      </Center>
    </Box>
  );
}
