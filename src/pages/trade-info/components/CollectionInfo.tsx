import React, { useState } from "react";
import { useCollectionTradeContext } from "../context";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import StarRounded from "@mui/icons-material/StarRounded";

const CollectionInfo: React.FC = () => {
  const { collectionData } = useCollectionTradeContext();
  const [favorite, setFavorite] = useState(false);
  return (
    <Box sx={{ px: 4, py: 2, width: "100%" }} className="scroll hide-scrollbar">
      <Stack direction="row">
        <Stack direction="row" alignItems="center" mr={2} minWidth={280}>
          {collectionData ? (
            <img alt={collectionData.name} width={60} height={60} />
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
              <Typography noWrap>{collectionData.name}</Typography>
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
              0
            </Box>
          }
        />
        <Stat name="List/Supply" loading={!collectionData} value={`0/0`} />
        <Stat name="1d Volume" loading={!collectionData} value={0} />
        <Stat name="1d Sales" loading={!collectionData} value={0} />
        <Stat name="Total Volume" loading={!collectionData} value={0} />
        <Stat name="Holders" loading={!collectionData} value={0} />
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
