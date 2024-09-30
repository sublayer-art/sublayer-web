import Center from "@/components/Center";
import Empty from "@/components/Empty";
import ResponsiveGrid from "@/components/ResponsiveGrid";
import { Box, Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import CollectionItem from "./CollectionItem";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRequest } from "ahooks";
import UserService from "@/services/user";

const CreatedCollections: React.FC = () => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const { data, loading, run, refresh } = useRequest(UserService.createdList, {
    manual: true,
  });

  useEffect(() => {
    if (address) {
      run({ address });
    }
  }, [address]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const records = data?.records || [];

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
    if (records.length === 0) {
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
        <ResponsiveGrid
          itemWidth={200}
          itemsCount={records.length}
          itemBuilder={(index) => {
            const item = records[index];
            return <CollectionItem data={item} />;
          }}
          hasMore={false}
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
  }, [address, loading, open, records, refresh]);
};
export default CreatedCollections;