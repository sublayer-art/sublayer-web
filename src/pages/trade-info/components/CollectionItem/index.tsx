import MoreHoriz from "@mui/icons-material/MoreHoriz";
import StarOutlineRounded from "@mui/icons-material/StarOutlineRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { DetailModel } from "../DetailModel/DetailModel";
import { ContractItemDTO, ContractItemMetaData } from "@/services/contract";
import { wei2Eth } from "@/tools/eth-tools";

const CollectionItem: React.FC<{
  data: ContractItemDTO;
  onBuy?: VoidFunction;
}> = ({ data, onBuy }) => {
  const [collectioned, setCollectioned] = useState(false);
  const hoverBGColor = "rgba(116, 127, 139, 0.42)";
  const item = data.items[0];
  const itemOwner = item.itemOwner;
  const metadata: ContractItemMetaData = JSON.parse(data.metadataContent);
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "0.4rem",
        position: "relative",
        cursor: "pointer",
        backgroundColor: "rgb(34,34,34)",
        userSelect: "none",

        ".actions": {
          display: "none",
          zIndex: 10,
        },
        ".img-mask": {
          backgroundColor: "transparent",
          position: "absolute",
          inset: 0,
        },

        ".CheckCircleOutline": {
          opacity: 0,
        },
        "&:hover": {
          ".actions": {
            display: "block",
          },
          ".card-content, .img-mask": {
            backgroundColor: hoverBGColor,
          },
          ".CheckCircleOutline": {
            opacity: 1,
          },
        },
      }}
      variant="outlined"
    >
      <Box
        className="actions"
        sx={{
          width: "100%",
          height: "100%",
          inset: 0,
          position: "absolute",
          pointerEvents: "none",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            height: "100%",
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            sx={{
              pointerEvents: "auto",
            }}
          >
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={(e) => {
                e.stopPropagation();
                onBuy?.();
              }}
            >
              Buy Now
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          aspectRatio: 0.75,
          width: "100%",
          height: "auto",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={data.imgUrl}
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        <Box className="img-mask">
          <Typography
            variant="body2"
            color="primary"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              borderRadius: "0.13rem",
              background: "rgba(28, 31, 21, 0.8)",
              height: "1.3rem",
              display: "inline-bolck",
              lineHeight: "1.3rem",
              minWidth: "3.5rem",
              px: 1,
              textAlign: "center",
            }}
          >
            {itemOwner.slice(itemOwner.length - 4).toUpperCase()}
          </Typography>
        </Box>
      </Box>

      <Stack className="card-content" sx={{ p: 1.25, height: 76 }}>
        <Stack direction="row" alignItems="center">
          {collectioned ? (
            <StarRounded
              sx={{
                cursor: "pointer",
                color: "primary.main",
                fontSize: 20,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCollectioned(false);
              }}
            />
          ) : (
            <StarOutlineRounded
              sx={{
                cursor: "pointer",
                fontSize: 20,
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCollectioned(true);
              }}
            />
          )}
          <Typography variant="body1" ml={0.5} sx={{ fontSize: "0.9rem" }}>
            {metadata.name}
          </Typography>
          <Typography variant="body1" ml="auto" sx={{ fontSize: "0.9rem" }}>
            #{data.tokenId}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" mt="auto">
          <Typography variant="body1" sx={{ flex: 1, fontWeight: "bold" }}>
            {wei2Eth(item.price, 6)} RING
          </Typography>
          <Button
            sx={{
              width: 24,
              height: 24,
              minWidth: "auto",
              p: 0,
              borderColor: "primary.main",
            }}
            variant="outlined"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              DetailModel.show({
                data,
              });
            }}
          >
            <MoreHoriz sx={{ fontSize: 16 }} />
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};
export default CollectionItem;
