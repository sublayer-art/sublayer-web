import ResponsiveGrid from "@/components/ResponsiveGrid";
import React, { useRef } from "react";
import CollectionItem from "../CollectionItem";
import { useCollectionTradeContext } from "../../context";
import { Box, CircularProgress, Skeleton, Stack } from "@mui/material";
import Center from "@/components/Center";
import Empty from "@/components/Empty";
import OrderModel, { OrderModelRef } from "../OrderModel";

const TradeItems: React.FC = () => {
  const orderModelRef = useRef<OrderModelRef>(null);
  const { buyState, loadItems, refresh } = useCollectionTradeContext();

  const { items = [], loading, hasMore } = buyState;

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
          <Empty />
        </div>
      </>
    );
  }
  return (
    <>
      <OrderModel ref={orderModelRef} onSuccess={refresh} />
      <ResponsiveGrid
        itemWidth={200}
        itemsCount={items.length}
        hasMore={hasMore}
        itemBuilder={(index) => {
          const item = items[index];
          return (
            <CollectionItem
              data={item}
              onBuy={() => orderModelRef.current?.show(item)}
            />
          );
        }}
        onLoadMore={loadItems}
        loadingIndicator={
          <Box sx={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                aspectRatio: 0.95,
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
};
export default TradeItems;
