import React, { useCallback, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
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
import useToast from "@/hooks/useToast";

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
const MintDialog = (props: MintDialogProps) => {
  const { open, onClose, contract } = props;
  const { address } = useAccount();
  const toast = useToast();
  const { writeContract } = useWriteContract();
  const [minting, setMinting] = useState(false);

  const handleMint = useCallback(async () => {
    if (!address || !contract) return;
    setMinting(true);
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
      writeContract(
        {
          abi: NFTAbi,
          address: contract.address,
          functionName: "mint",
          args: [tokenId, v, r, s, [], contract.coverIpfs],
        },
        {
          onSettled(data, error, variables, context) {
            console.log({ data, error, variables, context });
            setMinting(false);
          },
          onSuccess() {
            onClose();
            toast.success("mint successful!");
          },
        }
      );
    } catch (error) {
      setMinting(false);
    }
  }, [address, contract, writeContract, toast]);
  if (!contract) return null;
  return (
    <Dialog
      open={open}
      onClose={(_, r) => {
        if (r === "backdropClick") return;
        onClose();
      }}
      
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
    >
      <DialogTitle>Mint</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" mt={4}>
          <img
            src={contract.cover!}
            alt="name"
            style={{ width: 120, height: 120, objectFit: "contain" }}
          />
          <Typography my={1}>{contract.name}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2 }}>
        <Button
          variant="outlined"
          sx={{ minWidth: 100, flex: 1 }}
          disabled={minting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={minting}
          disabled={minting}
          sx={{ minWidth: 100, flex: 1 }}
          onClick={handleMint}
        >
          Mint
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
