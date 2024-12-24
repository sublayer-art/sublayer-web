import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";
import Spacer from "../Spacer";

const AppNavBar: React.FC = () => {
  return (
    <Box py={1} px={2} bgcolor="#222222" color="#fcfcfc">
      <Stack direction="row" height="100%" flexWrap={["wrap", 'wrap', 'nowrap']}>
        <Box
          component={Link}
          to="/"
          sx={{ textDecoration: "unset", flex: [1, 1, "unset"] }}
        >
          <Box m="auto" flexShrink={0}>
            <Stack direction="row" alignItems="center">
              <picture>
                <img
                  alt="logo"
                  height={32}
                  style={{ display: "block", width: "auto" }}
                  src="/logo.png"
                />
              </picture>
            </Stack>
          </Box>
        </Box>
        <Spacer />
        <NavList />
        <ConnectWallet />
      </Stack>
    </Box>
  );
};
export default AppNavBar;

function NavList() {
  const menus = [
    { name: "Trade", link: "/", match: "^/trade/\\d" },
    { name: "Mint", link: "/mint" },
    // { name: "Inscribe", link: "/inscribe" },
  ];

  const location = useLocation();

  return (
    <Box
      component="ul"
      sx={{
        display: "flex",
        listStyle: "none",
        alignItems: "center",
        margin: 0,
        padding: 0,
        order: [2, 2, "unset"],
        width: ["100%", "100%", "unset"],
        li: {
          mr: 4,
          a: {
            color: "inherit",
            display: "block",
            py: 0.5,
            px: 0.5,
            textDecoration: "none",
            position: "relative",

            "&::after": {
              position: "absolute",
              content: '""',
              left: 0,
              bottom: 0,
              width: "100%",
              height: 0,
              backgroundColor: "primary.main",
              transition: "height 125ms cubic-bezier(0, 0, 0.2, 1) 0ms ",
            },
          },

          "&[data-active=true]": {
            a: {
              color: "primary.main",

              "&::after": {
                height: 2,
              },
            },
          },
        },
      }}
    >
      {menus.map((menu) => {
        let active = menu.link === location.pathname;
        if (!active && menu.match) {
          active = new RegExp(menu.match).test(location.pathname);
        }
        return (
          <Box component="li" key={menu.link} data-active={active}>
            <Link to={menu.link}>
              <Typography>{menu.name}</Typography>
            </Link>
          </Box>
        );
      })}
    </Box>
  );
}
