import Center from "@/components/Center";
import Empty from "@/components/Empty";
import { Box, Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { useCollectionTradeContext } from "../../context";
import ListDialog, {
  ListAction,
} from "@/pages/profile/components/Collections/ListDialog";
import ResponsiveGrid from "@/components/ResponsiveGrid";
import CollectionItem from "@/pages/profile/components/Collections/CollectionItem";

const InventoryItems: React.FC = () => {
  const { sellState, loadItems, refresh } = useCollectionTradeContext();

  const { items = [], loading, hasMore } = sellState;

  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const listRef = useRef<ListAction>(null);

  return useMemo(() => {
    if (!address) {
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
    if (items.length === 0) {
      return (
        <>
          {loading && (
            <Center>
              <CircularProgress size={32} />
            </Center>
          )}
          <div
            style={{
              display: loading ? "none" : "block",
            }}
          >
            <Empty
              extra={
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={refresh}
                >
                  Refresh
                </Button>
              }
            />
          </div>
        </>
      );
    }
    return (
      <>
        <ListDialog ref={listRef} />
        <ResponsiveGrid
          itemWidth={200}
          itemsCount={items.length}
          itemBuilder={(index) => {
            const item = items[index];
            return (
              <CollectionItem
                data={item}
                onList={() => {
                  listRef.current?.list(item);
                }}
              />
            );
          }}
          onLoadMore={loadItems}
          hasMore={hasMore}
          loadingIndicator={
            <Box sx={{ width: "100%", height: "100%" }}>
              <Box
                sx={{
                  aspectRatio: 0.75,
                  width: "100%",
                  height: "auto",
                  position: "relative",
                }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Box>
              <Skeleton width="100%" sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Skeleton width="40%" />
                <Skeleton width="20%" />
              </Stack>
            </Box>
          }
        />
      </>
    );
  }, [address, items, loadItems, hasMore, open, loading, refresh]);
};
export default InventoryItems;
