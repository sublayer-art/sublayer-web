import React, { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import muiTheme from "./mui-theme";

import { SnackbarProvider } from "notistack";
import { Web3ModalProvider } from "./web3Privider";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Web3ModalProvider>
        <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
      </Web3ModalProvider>
    </ThemeProvider>
  );
};
export default Providers;
