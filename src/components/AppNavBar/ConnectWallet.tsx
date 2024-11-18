import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useNavigate } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import UserService from "@/services/user";
import useAuth from "@/store/auth";
import useToast from "@/hooks/useToast";

const ConnectWallet: React.FC = () => {
  const nav = useNavigate();
  const { token, setToken } = useAuth();
  const toast = useToast();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const openMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (address) {
      const domain = window.location.hostname;
      const nonce = Math.floor(Math.random() * 1e8);
      const timestamp = Date.now();
      const issuedAt = new Date(timestamp).toISOString();
      const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nWelcome to SubLayer\n\nURI: https://${domain}\nVersion: 1\nChain ID: 46\nNonce: ${nonce}\nIssued At: ${issuedAt}`;
      console.log({ message });
      signMessageAsync({
        account: address,
        message,
      }).then(async (signature) => {
        try {
          const loginResp = await UserService.loginWithSignature({
            userAddress: address,
            signature,
            timestamp,
            nonce
          });
          setToken(loginResp.token);
        } catch (error) {
          toast.error((error as Error).message || "Failed to login");
          disconnect();
        }
      });
    } else {
      disconnect();
      setToken(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const matchMD = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  if (address && token) {
    const addressText = `${address.slice(0, 4)}...${address.slice(
      address.length - 4
    )}`;

    const opened = Boolean(anchorEl);
    return (
      <Box
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        sx={{
          mr: [-1, 0],
        }}
      >
        <Button
          size="small"
          sx={{
            textTransform: "none",
            ".MuiButton-endIcon": {
              transition: "transform 120ms ease-in-out",
              transform: opened ? "rotateX(0deg)" : "rotateX(180deg)",
            },
          }}
          disableRipple
          endIcon={<KeyboardArrowUpIcon />}
        >
          {addressText}
        </Button>
        <Menu
          id="mouse-over-popover"
          hideBackdrop
          open={opened}
          sx={{
            pointerEvents: "none",
            ".MuiPaper-root": {
              pointerEvents: "auto",
              borderRadius: "6px",
              minWidth: 180,
              "& .MuiMenu-list": {
                padding: "4px 0",
              },
              "& .MuiMenuItem-root": {
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                  marginRight: 1.5,
                },
              },
            },
          }}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={closeMenu}
          disableRestoreFocus
        >
          <MenuItem
            onClick={() => {
              closeMenu();
              nav("/profile");
            }}
            disableRipple
          >
            <PersonIcon />
            Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              console.log("disconnect");
              closeMenu();
              disconnect();
            }}
            disableRipple
          >
            <LogoutIcon />
            Disconnect
          </MenuItem>
        </Menu>
      </Box>
    );
  }
  if (matchMD) {
    return (
      <IconButton
        color="primary"
        size="small"
        sx={{ mr: [-2, -1] }}
        onClick={() => {
          open({ view: "Connect" });
        }}
      >
        <AccountBalanceWalletOutlinedIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{ flexShrink: 0 }}
      onClick={() => {
        open({ view: "Connect" });
      }}
    >
      CONNECT WALLET
    </Button>
  );
};
export default ConnectWallet;
