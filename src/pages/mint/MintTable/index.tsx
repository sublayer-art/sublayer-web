import React, { useCallback, useState } from "react";
import {
  CircularProgress,
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

  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: 650,
          mx: "auto",

          ".MuiTableCell-root": {
            fontSize: "1rem",
            py: 1,
          },
          "th.MuiTableCell-root": {
            fontWeight: 700,
            fontSize: "1.125rem",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 220 }}>Collection</TableCell>
            <TableCell align="center">Deploy Time</TableCell>
            <TableCell align="center">Minted</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, index) => {
            return <ITableRow data={row} key={index} />;
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

function ITableRow({ data }: { data: ContractDTO }) {
  const { address } = useAccount();
  const toast = useToast();
  const { writeContract } = useWriteContract();
  const [minting, setMinting] = useState(false);
  const handleMint = useCallback(
    async (contract: ContractDTO) => {
      if (!address) return;
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
              toast.success("mint successful!");
            },
          }
        );
      } catch (error) {
        setMinting(false);
      }
    },
    [writeContract, address]
  );

  const supply = data.supply || 0;
  const minted = data.collectionCount || 0;

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" alignItems="center">
          <img
            src={data.cover!}
            height={60}
            alt="name"
            style={{ width: 60, height: 60, objectFit: "contain" }}
          />
          <Typography ml={2}>{data.name}</Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Typography>
          {new Date(data.createTime).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Stack alignItems="center">
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
              color="white"
              fontSize={12}
              lineHeight={'14px'}
            >
              {Math.round(minted / supply * 10000) / 100} %
            </Typography>
          </div>
          <Typography color="primary.main" mt={0.5}>
            {minted}/<span style={{ color: "white" }}>{supply}</span>
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">0 RING</TableCell>
      <TableCell align="center">
        <LoadingButton
          variant="contained"
          size="small"
          loading={minting}
          onClick={() => handleMint(data)}
        >
          Mint
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}
