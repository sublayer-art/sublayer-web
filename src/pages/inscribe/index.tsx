import Center from "@/components/Center";
import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import FormItem from "@/components/Form/FormItem";
import FormUpload from "./FormUpload";
import useAuth from "@/store/auth";
import { colorWithOpacity } from "@/tools/style";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Typography } from "@mui/material";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useDeployContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import bytecode from "./bytecode";
import abi from "./abi.json";
import Http from "@/tools/http";
import useToast from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function Inscribe() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { token } = useAuth();
  const toast = useToast();
  // https://wagmi.sh/react/api/hooks/useDeployContract
  const { deployContract } = useDeployContract();

  const signer = "0x8aab0d36dd9DD45ABCFeBd26C15735c08D0ee775";
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [formData, setFormData] = useState<Record<string, any>>();
  const [file, setFile] = useState<Record<string, any>>();

  const [contractAddress, setContractAddress] = useState<
    `0x${string}` | undefined
  >(undefined);
  const result = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const { address } = useAccount();

  console.log("Receipt result", result.data, result);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (result.data && result.data.contractAddress) {
      setContractAddress(result.data.contractAddress);
      setTxHash(undefined);
    }
  }, [result.data]);

  useEffect(() => {
    if (createLoading || !contractAddress || !file || !formData) return;
    const { name, symbol, supply } = formData;
    setCreateLoading(true);
    const params = {
      name,
      symbol,
      supply,
      signer,
      address: contractAddress,
      cover: file.url,
      coverIpfs: file.ipfshash,
      storageId: file.id,
      owner: address,
    };
    Http.post("/contract/create", null, { params })
      .then(() => {
        toast.success("Create NFT Collection Success");
        setContractAddress(undefined);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message || "Create NFT Collection Failed");
      })
      .finally(() => {
        setCreateLoading(false);
        setSubmitting(false);
      });
  }, [formData, createLoading, address, toast, file, contractAddress, navigate]);

  const handleDeploy = useCallback(
    async (values: any) => {
      if (submitting) return;
      if (!file) {
        toast.error("Please upload file");
        return;
      }
      const { name, symbol, supply } = values;
      setSubmitting(true);
      setFormData(values);
      deployContract(
        {
          abi: abi,
          bytecode: `0x${bytecode}`,
          args: [name, symbol, supply, signer],
        },
        {
          onSuccess(data, variables, context) {
            console.log("deploy success", { data, variables, context });
            setTxHash(data);
          },
          onError(error, variables, context) {
            console.log("deploy error", { error, variables, context });
            setSubmitting(false);
          },
        }
      );
    },
    [deployContract, file, submitting, toast]
  );

  if (!token && !isConnected) {
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
            Launchpad
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
              onSubmit={handleDeploy}
              initialValues={{
                name: "",
                symbol: "",
                supply: "",
                file: "",
              }}
            >
              <FormItem label="Upload File" name="file">
                <FormUpload onChange={setFile} />
              </FormItem>
              <FormItem label="Name" name="name" required>
                <FormInput placeholder="please enter" />
              </FormItem>
              <FormItem label="Symbol" name="symbol" required>
                <FormInput placeholder="please enter" />
              </FormItem>
              <FormItem label="Supply" name="supply" required>
                <FormInput placeholder="please enter" />
              </FormItem>

              <LoadingButton
                variant="contained"
                fullWidth
                type="submit"
                loading={submitting}
              >
                Deploy
              </LoadingButton>
            </Form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
