import React, { useState } from "react";
import { useCollectionTradeContext } from "../context";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import { wei2Eth } from "@/tools/eth-tools";

const CollectionInfo: React.FC = () => {
  const { collectionData } = useCollectionTradeContext();
  const [favorite, setFavorite] = useState(false);
  return (
    <Box sx={{ px: 4, py: 2, width: "100%" }} className="scroll">
      <Stack direction="row">
        <Stack direction="row" alignItems="center" mr={2} minWidth={280}>
          <Box width={60} height={60} flexShrink={0}>
            {collectionData ? (
              <img
                src={collectionData.cover}
                style={{ width: 60, height: 60, objectFit: "contain" }}
              />
            ) : (
              <Skeleton width={60} height={60} />
            )}
          </Box>
          <Stack height="100%">
            <Stack direction="row" alignItems="center">
              {collectionData ? (
                <>
                  <IconButton onClick={() => setFavorite((v) => !v)}>
                    {favorite ? (
                      <StarRounded color="primary" />
                    ) : (
                      <StarBorderRounded />
                    )}
                  </IconButton>
                  <Typography noWrap>{collectionData.name}</Typography>
                </>
              ) : (
                <Skeleton height={32} width={100} sx={{ mx: 1, my: 1 }} />
              )}
            </Stack>

            <Box mt="auto" ml={1}>
              <Typography fontSize={12} style={{ wordBreak: "break-all" }}>
                {collectionData?.address}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Stat
          name="Floor"
          loading={!collectionData}
          value={
            <Box component={"span"} color="primary.main">
              {collectionData?.price
                ? `${wei2Eth(BigInt(collectionData.price))} RING`
                : "-"}
            </Box>
          }
        />
        <Stat
          name="Listed/Total"
          loading={!collectionData}
          value={`${collectionData?.saleCount ?? 0}/${
            collectionData?.collectionCount ?? 0
          }`}
        />
      </Stack>
    </Box>
  );
};
export default CollectionInfo;

const Stat: React.FC<{
  name: string;
  value: React.ReactNode;
  loading?: boolean;
}> = ({ name, value, loading = false }) => {
  return (
    <Stack sx={{ minWidth: 160, px: 2 }} alignItems="center">
      <Typography
        variant="body1"
        sx={{ color: "rgb(116, 127, 139)", lineHeight: 1.5, fontWeight: 700 }}
      >
        {name}
      </Typography>
      {loading ? (
        <Skeleton>
          <Typography
            sx={{ fontSize: "1.15rem", minWidth: 60, lineHeight: 1.6 }}
          >
            {value}
          </Typography>
        </Skeleton>
      ) : (
        <Typography sx={{ fontSize: "1.15rem", lineHeight: 1.6 }}>
          {value}
        </Typography>
      )}
    </Stack>
  );
};
