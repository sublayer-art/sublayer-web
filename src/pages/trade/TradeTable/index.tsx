import React from "react";
import {
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

const TradeTable: React.FC = () => {
  const nav = useNavigate();

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
            <TableCell align="center">Floor</TableCell>
            <TableCell align="center">1d Volume</TableCell>
            <TableCell align="center">1d Sales</TableCell>
            <TableCell align="center">Market cap</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, index) => {
            return (
              <TableRow
                hover
                key={index}
                onClick={() => {
                  nav("/trade/" + row.address, { state: { data: row } });
                }}
              >
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
                    {/* <img
                      src={row.image}
                      width={60}
                      height={60}
                      alt="name"
                    /> */}
                    <Typography ml={2}>{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Typography color="primary.main">0 ETH</Typography>
                </TableCell>
                <TableCell align="center">-</TableCell>
                <TableCell align="center">-</TableCell>
                <TableCell align="center">-</TableCell>
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
