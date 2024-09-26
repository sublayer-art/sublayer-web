import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const Activity: React.FC = () => {
  const data = [0, 0, 1, 0];

  return (
    <div className="h-full overflow-auto scroll-smooth px-page py-3">
      <TableContainer>
        <Table
          sx={{
            minWidth: 650,
            maxWidth: 1000,

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
              <TableCell>Item</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Buyer</TableCell>
              <TableCell align="center">Seller</TableCell>
              <TableCell align="center" sx={{ minWidth: 150 }}>
                Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover key={index} sx={{ td: { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" width={200}>
                    <Box sx={{ borderRadius: "4px" }}>
                      <img src="/nft.jpg" width={60} height={60} alt="" />
                    </Box>
                    <Stack ml={1.5} py={0.5}>
                      <Box
                        sx={{
                          backgroundColor: row
                            ? "secondary.main"
                            : "primary.main",
                          borderRadius: "0.15rem",
                          height: "1.7rem",
                          lineHeight: "1.7rem",
                          px: 1,
                          textAlign: "center",
                          color: row
                            ? "primary.contrastText"
                            : "secondary.contrastText",
                        }}
                      >
                        {row ? "LIST" : "BUY"}
                      </Box>
                      <Typography variant="body1" mt="auto" lineHeight={1.5}>
                        shenlong
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell align="center">0.01</TableCell>
                <TableCell align="center">894T...V537</TableCell>
                <TableCell align="center">E9aP...SCf3</TableCell>
                <TableCell align="center">2 mins ago</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default Activity;
