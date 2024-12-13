import { Box, CircularProgress, Stack } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavBar from "./components/AppNavBar";
import { Suspense } from "react";
import Center from "./components/Center";
import Providers from "./providers";
import Mint from "./pages/mint";
import Profile from "./pages/profile";
import TradeInfo from "./pages/trade-info";
import Trade from "./pages/trade";
import Inscribe from "./pages/inscribe";

function App() {
  return (
    <Providers>
      <BrowserRouter basename="/">
        <Stack height="100%" overflow="hidden">
          <AppNavBar />
          <Box flex={1} overflow="hidden">
            <Suspense
              fallback={
                <Center>
                  <CircularProgress />
                </Center>
              }
            >
              <Routes>
                <Route path="/launchpad" element={<Inscribe />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/trade/:caddress" element={<TradeInfo />} />
                <Route path="/" element={<Trade />} />
              </Routes>
            </Suspense>
          </Box>
        </Stack>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
