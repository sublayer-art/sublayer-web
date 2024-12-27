import React from "react";
import {
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StarRounded from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useRequest } from "ahooks";
import Center from "@/components/Center";
import Empty from "@/components/Empty";
import ContractService from "@/services/contract";
import { wei2Eth } from "@/tools/eth-tools";

const TradeTable: React.FC = () => {
  const nav = useNavigate();

  const { data, loading } = useRequest(ContractService.listAll);
  const { records = [] } = data || {};

  const handleToTrade = (row: any) => {
    nav("/trade/" + row.address, { state: { data: row } });
  };

  return (
    <TableContainer>
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
            <TableCell sx={{ width: 40, display: ["none", "table-cell"] }}>
              <StarRounded />
            </TableCell>
            <TableCell sx={{ width: 40, display: ["none", "table-cell"] }}>
              <LocalFireDepartmentIcon />
            </TableCell>
            <TableCell sx={{ flex: 1 }}>Collection</TableCell>
            <TableCell
              width={180}
              sx={{ display: ["none", "table-cell"] }}
            >
              Floor
            </TableCell>
            <TableCell
              align="center"
              width={120}
              sx={{ display: ["none", "table-cell"] }}
            >
              Listed
            </TableCell>
            <TableCell
              align="center"
              width={120}
              sx={{ display: ["none", "table-cell"] }}
            >
              Total
            </TableCell>
            <TableCell sx={{ display: ["table-cell", "none"], width: "120px" }}>
              Volume
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
            return (
              <TableRow
                hover
                key={index}
                onClick={() => handleToTrade(row)}
                sx={{
                  display: ["flex", "table-row"],
                  width: "100vw",
                  overflow: "hidden",
                }}
              >
                <TableCell sx={{ display: ["none", "table-cell"] }}>
                  <Stack direction="row">
                    <StarOutlineRoundedIcon name="star" />
                    {/* <Typography ml={0.5}>0</Typography> */}
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: ["none", "table-cell"] }}>
                  {index < 3 && (
                    <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />
                  )}
                </TableCell>
                <TableCell sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    overflow="hidden"
                    width="100%"
                  >
                    <img
                      src={row.cover!}
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
                        {row.name}
                      </Typography>
                      <Typography color="primary.main" fontSize="0.75rem"  sx={{ display: ["block", "none"] }}>
                        Floor:
                        {row.price ? `${wei2Eth(BigInt(row.price))} RING` : "-"}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{ display: ["none", "table-cell"] }}
                >
                  <Typography color="primary.main">
                    {row.price ? `${wei2Eth(BigInt(row.price))} RING` : "-"}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: ["none", "table-cell"] }}
                >
                  {row.saleCount}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: ["none", "table-cell"] }}
                >
                  {row.collectionCount}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    flexShrink: 0,
                    display: ["table-row", "none"],
                    width: "120px",
                  }}
                >
                  <Stack justifyContent="space-around" alignItems="start"  py={1} height="100%">
                    <Typography fontSize="0.75rem">Listed:{row.saleCount}</Typography>
                    <Typography fontSize="0.75rem">Total:{row.collectionCount}</Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: ["none", "table-cell"] }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleToTrade(row)}
                  >
                    Trade
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
export default TradeTable;
