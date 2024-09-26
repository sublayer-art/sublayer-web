import React, { useCallback } from "react";
import {
  Box,
  Button,
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

const MintTable: React.FC = () => {
  const { data, loading, refresh } = useRequest(ContractService.listAll);
  const { records = [] } = data || {};

  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const handleMint = useCallback(
    async (contract: ContractDTO) => {
      if (!address) return;
      const { tokenId, r, s, v } = await DAPPService.signMessage(
        contract.address
      );

      writeContract(
        {
          abi: NFTAbi,
          address: contract.address,
          functionName: "mint",
          args: [
            tokenId,
            v,
            r,
            s,
            [],
            "/ipfs/bafkreiggk6hokdb7iyqvjqerthnimh2tmkdl2xfjxcjei2dl2ku2ouh7fe",
          ],
        },
        {
          onSettled(data, error, variables, context) {
            console.log({ data, error, variables, context });
          },
          onSuccess(data) {
            NFTService.add({
              contractId: contract.id,
              address: contract.address,
              categoryId: 0,
              imgUrl: "abc",
              storageId: 1,
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
              txHash: data,
              animUrl: "",
              animStorageId: 0,
              metadataUrl: "",
              metadataContent: "",
              getMetaTimes: 0,
              // address: contract.address,
            } as any);
          },
        }
      );
    },
    [writeContract, address]
  );

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
            return (
              <TableRow hover key={index}>
                <TableCell>
                  <Stack direction="row">
                    <StarOutlineRoundedIcon name="star" />
                    <Typography ml={0.5}>{index + 1}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {(index + 1) % 2 === 0 && (
                    <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center">
                    <Typography ml={2}>{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Typography color="primary.main">
                    {new Date(row.createTime).toLocaleDateString()}
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
                        {Math.round(10) / 100}%
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell align="center">0 ETH</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleMint(row)}
                  >
                    Mint
                  </Button>
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
