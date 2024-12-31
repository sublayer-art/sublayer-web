import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRequest } from "ahooks";
import Center from "@/components/Center";
import Empty from "@/components/Empty";
import ContractService, { ContractDTO } from "@/services/contract";
import { useAccount, useWriteContract } from "wagmi";
import DAPPService from "@/services/dapp";
import NFTAbi from "@/contract/abis/NFT.json";
import NFTService from "@/services/nft";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import Result from "@/components/Result";

const MintTable: React.FC = () => {
  const { data, loading } = useRequest(ContractService.listAll);
  const { records = [] } = data || {};
  const [open, setOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState<ContractDTO>();
  return (
    <TableContainer>
      <MintDialog
        open={open}
        onClose={() => setOpen(false)}
        contract={currentContract}
      />
      <Table
        sx={{
          minWidth: ["unset", 650],
          mx: "auto",

          ".MuiTableCell-root": {
            fontSize: "1rem",
            py: 1,
          },
          "th.MuiTableCell-root": {
            fontWeight: 700,
            fontSize: ["1rem", "1.125rem"],
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ display: ["flex", "table-row"], width: "100vw" }}>
            <TableCell sx={{ flex: 1 }}>Collection</TableCell>
            <TableCell
              align="center"
              width="200px"
              sx={{ display: ["none", "table-cell"] }}
            >
              Deploy Time
            </TableCell>
            <TableCell align="center" width="154px">
              Minted
            </TableCell>
            <TableCell
              align="center"
              width={160}
              sx={{ display: ["none", "table-cell"] }}
            >
              Price
            </TableCell>
            <TableCell
              align="center"
              width={120}
              sx={{ display: ["none", "table-cell"] }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, index) => {
            const data = row;
            const supply = data.supply || 0;
            const minted = data.collectionCount || 0;
            return (
              <TableRow
                key={index}
                hover
                sx={{
                  display: ["flex", "table-row"],
                  width: "100vw",
                  overflow: "hidden",
                }}
                onClick={() => {
                  if (minted >= supply) {
                    toast.error("Minted out!");
                    return;
                  }
                  setCurrentContract(data);
                  setOpen(true);
                }}
              >
                <TableCell sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    overflow="hidden"
                    width="100%"
                  >
                    <img
                      src={data.cover!}
                      alt="name"
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                    <Stack ml={2} width={0} flex={1}>
                      <Typography
                        fontSize={["0.875rem", "1rem"]}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {data.name}
                      </Typography>
                      <Typography
                        color="primary.main"
                        fontSize="0.75rem"
                        sx={{ display: ["block", "none"] }}
                      >
                        0 RING
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: ["none", "table-cell"] }}
                >
                  <Typography>
                    {new Date(data.createTime).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center" width="154px">
                  <Stack
                    alignItems="center"
                    height="100%"
                    justifyContent="center"
                  >
                    <div style={{ position: "relative" }}>
                      <LinearProgress
                        variant="determinate"
                        color="inherit"
                        value={(minted / supply) * 100}
                        sx={{ width: 120, height: 14 }}
                      />
                      <Typography
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        color="black"
                        fontSize={12}
                        lineHeight={"14px"}
                      >
                        {Math.round((minted / supply) * 10000) / 100} %
                      </Typography>
                    </div>
                    <Typography color="primary.main" mt={0.5}>
                      {minted}/<span style={{ color: "white" }}>{supply}</span>
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: ["none", "table-cell"] }}
                >
                  0 RING
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: ["none", "table-cell"] }}
                >
                  <LoadingButton
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setCurrentContract(data);
                      setOpen(true);
                    }}
                    disabled={minted >= supply}
                  >
                    Mint
                  </LoadingButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {records.length === 0 && (
        <Center
          sx={{
            minHeight: 200,
            width: "100%",
          }}
        >
          {loading ? <CircularProgress /> : <Empty />}
        </Center>
      )}
    </TableContainer>
  );
};
export default MintTable;

type MintDialogProps = {
  open: boolean;
  onClose: () => void;
  contract?: ContractDTO;
};

enum MintStatus {
  Normal,
  Approving,
  Minting,
  Success,
  Failed,
}

const MintDialog = (props: MintDialogProps) => {
  const { open, onClose, contract } = props;
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [status, setStatus] = useState(MintStatus.Normal);
  const [errorText, setErrorText] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStatus(MintStatus.Normal);
      setErrorText("");
      setTxHash("");
    }, 500);
  }, [onClose]);

  const handleMint = useCallback(async () => {
    if (!address || !contract) return;
    setStatus(MintStatus.Approving);
    try {
      const { tokenId, r, s, v } = await DAPPService.signMessage(
        contract.address
      );
      await NFTService.add({
        contractId: contract.id,
        address: contract.address,
        categoryId: 0,
        imgUrl: contract.cover,
        storageId: contract.storageId,
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
        animUrl: "",
        animStorageId: 0,
        // address: contract.address,
      } as any);
      setStatus(MintStatus.Minting);
      writeContract(
        {
          abi: NFTAbi,
          address: contract.address,
          functionName: "mint",
          args: [tokenId, v, r, s, [], contract.coverIpfs],
        },
        {
          onSuccess(data) {
            setStatus(MintStatus.Success);
            setTxHash(data);
          },
          onError(error) {
            const errMsg =
              (error as any).shortMessage || error.message || "mint failed!";
            console.log(errMsg);
            setErrorText(errMsg);
            setStatus(
              errMsg === "User rejected the request."
                ? MintStatus.Normal
                : MintStatus.Failed
            );
          },
        }
      );
    } catch (error) {
      setErrorText((error as any).message || "mint failed!");
      setStatus(MintStatus.Failed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  const _content = useMemo(() => {
    if (!contract) return null;
    if (status === MintStatus.Success) {
      return (
        <Result
          type="success"
          title="Mint successful!"
          maxWidth={400}
          subtitle="Synced to the blockchain in about 1 minute"
          extra={
            <Stack
              direction="row"
              minHeight={44}
              gap={2}
              mt={2}
              width="100%"
              justifyContent="center"
            >
              <Button variant="outlined" fullWidth onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() =>
                  window.open(
                    `https://explorer.darwinia.network/tx/${txHash}`,
                    "_blank"
                  )
                }
              >
                View
              </Button>
            </Stack>
          }
        />
      );
    }
    if (status === MintStatus.Failed) {
      return (
        <Result
          type="error"
          title="Mint failed!"
          subtitle={errorText}
          extra={<Button fullWidth variant="outlined" sx={{mt:2}} onClick={handleClose}>Close</Button>}
        />
      );
    }
    return (
      <Stack alignItems="center">
        <img
          src={contract.cover!}
          alt="name"
          style={{ width: 120, height: 120, objectFit: "contain" }}
        />
        <Typography my={1}>{contract.name}</Typography>

        <Stack
          direction="row"
          minHeight={44}
          gap={2}
          mt={2}
          width="100%"
          justifyContent="center"
        >
          {status === MintStatus.Minting ? (
            <Typography textAlign="center">Minting, please wait...</Typography>
          ) : (
            <>
              <Button
                variant="outlined"
                fullWidth
                disabled={status !== MintStatus.Normal}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                loading={status === MintStatus.Approving}
                fullWidth
                onClick={handleMint}
              >
                Mint
              </LoadingButton>
            </>
          )}
        </Stack>
      </Stack>
    );
  }, [contract, errorText, handleMint, handleClose, status, txHash]);

  if (!contract) return null;
  return (
    <Dialog
      open={open}
      onClose={(_, r) => {
        if (r === "backdropClick") return;

        handleClose();
      }}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
    >
      <DialogTitle>Mint</DialogTitle>
      <DialogContent sx={{ pt: 4 }}>{_content}</DialogContent>
    </Dialog>
  );
};
