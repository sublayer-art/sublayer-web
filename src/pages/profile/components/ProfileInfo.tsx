import { wei2Eth } from "@/tools/eth-tools";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useAccount, useBalance } from "wagmi";

const ProfileInfo: React.FC = () => {
  const { address } = useAccount();
  const balance = useBalance({ address });

  const addressText = address
    ? `${address.slice(0, 4)}...${address.slice(address.length - 4)}`
    : "";

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={700}>
        Profile
      </Typography>
      <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
        <Stack component="li" direction="row" my={1}>
          <Typography>Wallet Address</Typography>
          <Typography ml="auto" color="primary">
            {addressText}
          </Typography>
        </Stack>
        <Stack component="li" direction="row" my={1}>
          <Typography>Wallet Balance</Typography>
          <Typography ml="auto" color="primary">
            {wei2Eth(balance.data?.value)} {balance.data?.symbol}
          </Typography>
        </Stack>
        <Stack component="li" direction="row" my={1}>
          <Typography>Total Listed</Typography>
          <Typography ml="auto" color="primary">
            0/0
          </Typography>
        </Stack>
        <Stack component="li" direction="row" my={1}>
          <Typography>Collections</Typography>
          <Typography ml="auto" color="primary">
            0
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};
export default ProfileInfo;
