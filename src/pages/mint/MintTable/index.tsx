import React, { useCallback, useState } from "react";
import {
  Box,
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
import StarRounded from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useRequest } from "ahooks";
import Center from "@/components/Center";
import Empty from "@/components/Empty";
import ContractService, { ContractDTO } from "@/services/contract";
import { useAccount, useWriteContract } from "wagmi";
import DAPPService from "@/services/dapp";
import NFTAbi from "@/contract/abis/NFT.json";
import NFTService from "@/services/nft";
import { LoadingButton } from "@mui/lab";

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
            <TableCell sx={{ width: 80 }}>
              <StarRounded />
            </TableCell>
            <TableCell sx={{ width: 40 }}>
              <LocalFireDepartmentIcon />
            </TableCell>
            <TableCell sx={{ width: 220 }}>Collection</TableCell>
            <TableCell align="center">Deploy Time</TableCell>
            <TableCell align="center">Progress</TableCell>
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

function ITableRow({
  data,
  hot = false,
}: {
  data: ContractDTO;
  hot?: boolean;
}) {
  const { address } = useAccount();
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
          }
        );
      } catch (error) {
        setMinting(false);
      }
    },
    [writeContract, address]
  );

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row">
          <StarOutlineRoundedIcon name="star" />
          <Typography ml={0.5}>0</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {hot && <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />}
      </TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center">
          <img src={data.cover!} height={60} alt="name" />
          <Typography ml={2}>{data.name}</Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Typography color="primary.main">
          {new Date(data.createTime).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Stack width={120} mx="auto">
          <Box sx={{ width: "100%", mr: 1, position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={10}
              sx={{ height: 18 }}
            />
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                lineHeight: "18px",
                width: "100%",
                color: "primary.contrastText",
              }}
            >
              {Math.round(Math.random() * 1000) / 100}%
            </Typography>
          </Box>
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
