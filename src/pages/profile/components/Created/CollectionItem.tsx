import { DetailModel } from "@/pages/trade-info/components/DetailModel/DetailModel";
import { CollectionDTO } from "@/services/user";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import React from "react";

const CollectionItem: React.FC<{
  data: CollectionDTO;
}> = ({ data }) => {
  const hoverBGColor = "rgba(116, 127, 139, 0.42)";

  const metadata = JSON.parse(data.metadataContent);

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
        sx={{
          aspectRatio: 0.75,
          width: "100%",
          height: "auto",
          position: "relative",
        }}
      >
        <img
          src={data.imgUrl}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        <Box className="img-mask"></Box>
      </Box>

      <Stack className="card-content" sx={{ p: 1.25, height: 76 }}>
        <Stack direction="row" alignItems="center">
          <Typography variant="body1" ml={0.5} sx={{ fontSize: "0.9rem" }}>
            #{data.tokenId}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" mt="auto">
          <Typography
            variant="body1"
            sx={{
              flex: 1,
              fontSize: ["0.875rem", "1rem", "1.25rem"],
              fontWeight: "bold",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              mr: 1,
            }}
          >
            {metadata.name}
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
