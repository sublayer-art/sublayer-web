import Center from "@/components/Center";
import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormItem from "@/components/Form/FormItem";
import FormUpload from "@/components/Form/FormUpload";
import { ERC721RaribleFactoryC2Abi } from "@/contract/abis/ERC721RaribleFactoryC2";
import { ERC721RaribleFactoryC2Address } from "@/contract/addresses";
import { colorWithOpacity } from "@/tools/style";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Typography } from "@mui/material";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useCallback, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

const unifiGamesArgs = [
  "unifi-games-test",
  "UGT",
  "ipfs://",
  "ipfs://QmQGh5symCyvr5zY91KGMRK4B29uXetLv681Bocaqjpe2D/0",
  [],
  [],
];

export default function Inscribe() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const getAddressResult = useReadContract({
    abi: ERC721RaribleFactoryC2Abi,
    address: ERC721RaribleFactoryC2Address.sepolia,
    functionName: "getAddress",
    args: unifiGamesArgs,
  });
  const { writeContract } = useWriteContract();
  console.log({ getAddressResult });
  const [submitting] = useState(false);

  const handleSubmit = useCallback(() => {
    writeContract(
      {
        abi: ERC721RaribleFactoryC2Abi,
        address: ERC721RaribleFactoryC2Address.sepolia,
        functionName: "createToken",
        args: unifiGamesArgs,
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
  }, [writeContract]);

  if (!isConnected) {
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
  return (
    <Box height="100%" className="scroll">
      <Container>
        <Box
          my={5}
          sx={(theme) => ({
            backgroundColor: colorWithOpacity(theme.palette.primary.main, 0.15),
            p: [2, 3, 5],
            borderRadius: 2,
          })}
        >
          <Typography
            variant="h3"
            fontSize={[24, 32, 48]}
            color="primary"
            fontWeight={700}
            textAlign="center"
          >
            Create NFT
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            mx: "auto",
          }}
        >
          <Box
            overflow="hidden"
            sx={(theme) => ({
              backgroundColor: colorWithOpacity(
                theme.palette.primary.main,
                0.15
              ),
              borderRadius: 2,
              mb: 2,
              p: 2,
            })}
          >
            <Form
              onSubmit={async () => {
                handleSubmit();
              }}
              initialValues={{
                tick: "",
                amount: "",
                price: "",
                files: "",
              }}
            >
              <FormItem label="Upload Files" name="files" required>
                <FormUpload />
              </FormItem>
              <FormItem label="Tick" name="tick" required>
                <FormInput placeholder="please enter" />
              </FormItem>
              <FormItem label="Amount" name="amount" required>
                <FormInput placeholder="please enter" />
              </FormItem>
              <FormItem label="Price(BTC)" name="price" required>
                <FormInput placeholder="please enter" />
              </FormItem>

              <LoadingButton
                variant="contained"
                fullWidth
                type="submit"
                loading={submitting}
              >
                Submit
              </LoadingButton>
            </Form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
