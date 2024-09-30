import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { defineChain } from "viem";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "c5ad81c62e7ad0b1a0eab01d6f69ab2d";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const darwinia = defineChain({
  id: 701,
  name: "Darwinia Koi Testnet",
  nativeCurrency: { name: "RING", symbol: "RING", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://koi-rpc.darwinia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: 'KoiScan',
      url: 'https://koi-scan.darwinia.network',
      apiUrl: 'https://koi-scan.darwinia.network/api',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
      blockCreated: 19_258_213,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
});
const chains = [darwinia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions, // Optional - Override createConfig parameters
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
  themeMode: "dark",
  // themeVariables: {
  //   '--w3m-color-mix': '#00BB7F',
  //   '--w3m-color-mix-strength': 40
  // }
});

export function Web3ModalProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
