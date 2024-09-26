import Center from "@/components/Center";
import Empty from "@/components/Empty";
import { Button } from "@mui/material";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import React from "react";
import { useAccount } from "wagmi";

const InventoryItems: React.FC = () => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <Center sx={{ height: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => open({ view: "Connect" })}
        >
          CONNECT WALLET
        </Button>
      </Center>
    );
  }

  return (
    <div>
      <Empty
        type="error"
        extra={
          <Button fullWidth variant="outlined" size="small">
            Refresh
          </Button>
        }
      />
    </div>
  );
};
export default InventoryItems;
