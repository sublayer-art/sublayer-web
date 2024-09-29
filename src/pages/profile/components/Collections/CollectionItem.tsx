import { CollectionDTO } from "@/services/user";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import React from "react";

const CollectionItem: React.FC<{
  data: CollectionDTO;
  onList: VoidFunction;
}> = ({ data, onList }) => {
  const hoverBGColor = "rgba(116, 127, 139, 0.42)";

  const metadata = JSON.parse(data.metadataContent);
  console.log('metadata:',metadata)
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
            {
              
            }
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={(e) => {
                e.stopPropagation();
                onList();
              }}
            >
              List
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          aspectRatio: 0.95,
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
            sx={{ flex: 1, fontSize: "1.25rem", fontWeight: "bold" }}
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
