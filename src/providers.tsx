import React, { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import muiTheme from "./mui-theme";

import { SnackbarProvider } from "notistack";
import { Web3ModalProvider } from "./web3Privider";
import Toaster from "./components/Toaster";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Toaster />
      <CssBaseline />
      <Web3ModalProvider>
        <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
      </Web3ModalProvider>
    </ThemeProvider>
  );
};
export default Providers;
