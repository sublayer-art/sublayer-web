import React, { useState } from "react";
import { useCollectionTradeContext } from "../context";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import StarRounded from "@mui/icons-material/StarRounded";

const CollectionInfo: React.FC = () => {
  const { collectionData } = useCollectionTradeContext();
  const [favorite, setFavorite] = useState(false);
  return (
    <Box sx={{ px: 4, py: 2, width: "100%" }} className="scroll hide-scroll">
      <Stack direction="row">
        <Stack direction="row" alignItems="center" mr={2} minWidth={280}>
          {collectionData ? (
            <img
              alt="nft"
              width={60}
              height={60}
              src={collectionData.goodsImage}
            />
          ) : (
            <Skeleton width={60} height={60} />
          )}
          {collectionData ? (
            <>
              <IconButton disableRipple onClick={() => setFavorite((v) => !v)}>
                {favorite ? (
                  <StarRounded color="primary" />
                ) : (
                  <StarBorderRounded />
                )}
              </IconButton>
              <Typography noWrap>{collectionData.goodsName}</Typography>
            </>
          ) : (
            <Skeleton height={28} sx={{ mx: 2, flex: 1 }} />
          )}
        </Stack>
        <Stat
          name="Floor"
          loading={!collectionData}
          value={
            <Box component={"span"} color="primary.main">
              {collectionData?.goodsSalesFloor}
            </Box>
          }
        />
        <Stat name="List/Supply" loading={!collectionData} value="120/1000" />
        <Stat
          name="List/Supply"
          loading={!collectionData}
          value={`${collectionData?.goodsOnSalesNum}/${collectionData?.goodsCastNum}`}
        />
        <Stat
          name="1d Volume"
          loading={!collectionData}
          value={collectionData?.goodsTodayVolume}
        />
        <Stat
          name="1d Sales"
          loading={!collectionData}
          value={collectionData?.goodsTodayOrderNum}
        />
        <Stat
          name="Total Volume"
          loading={!collectionData}
          value={collectionData?.goodsTotalVolume}
        />
        <Stat
          name="Holders"
          loading={!collectionData}
          value={collectionData?.goodsHoldersNum}
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
