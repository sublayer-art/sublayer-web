import Providers from "@/providers";
import { wei2Eth } from "@/tools/eth-tools";
import { Box, Dialog, DialogProps, Stack, Typography } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";

type DetailModelBaseProps = {
  data: any;
};

type DetailModelProps = Partial<DialogProps> & DetailModelBaseProps;

export const DetailModel: React.FC<DetailModelProps> & {
  show: (props: DetailModelProps) => VoidFunction;
} = (props) => {
  const { data, open = false, ...reset } = props;
  const metadata = JSON.parse(data.metadataContent);

  return (
    <Providers>
      <Dialog {...reset} open={open} maxWidth="sm" fullWidth>
        <Box sx={{ px: 3, py: 4, minHeight: "40vh", maxHeight: "80vh" }}>
          <Stack direction={"row"} gap={2}>
            <Box
              component="img"
              src={data.imgUrl}
              alt=""
              sx={{
                borderRadius: 2,
                height: "80px",
                width: "80px",
                objectFit: "cover",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Stack height={"100%"}>
                <Typography variant="h6" fontWeight="700">
                  {metadata.name} #{data.tokenId}
                </Typography>
                {data.items?.[0]?.price && (
                  <Typography variant="h6" mt="auto">
                    {wei2Eth(data.items?.[0]?.price)}{" "}
                    {data.items?.[0]?.paytokenSymbol}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>

          <Box py={2}>
            <Stack
              direction="row"
              py={1}
              justifyContent="space-between"
              alignItems="start"
            >
              <Typography sx={{ flex: "0 0 120px" }}>address</Typography>
              <Typography
                component="a"
                target="_blank"
                href={`https://koi-scan.darwinia.network/address/${data.items?.[0]?.address}`}
                sx={{
                  wordBreak: "break-all",
                  color: "primary.main",
                }}
              >
                {data.items?.[0]?.address}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              py={1}
              justifyContent="space-between"
              alignItems="start"
            >
              <Typography sx={{ flex: "0 0 120px" }}>creator</Typography>
              <Typography
                component="a"
                target="_blank"
                href={`https://koi-scan.darwinia.network/address/${data.creator}`}
                sx={{
                  wordBreak: "break-all",
                  color: "primary.main",
                }}
              >
                {data.creator}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              py={1}
              justifyContent="space-between"
              alignItems="start"
            >
              <Typography sx={{ flex: "0 0 120px" }}>owner</Typography>
              <Typography
                component="a"
                target="_blank"
                href={`https://koi-scan.darwinia.network/address/${data.items?.[0]?.itemOwner}`}
                sx={{
                  wordBreak: "break-all",
                  color: "primary.main",
                }}
              >
                {data.items?.[0]?.itemOwner}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Dialog>
    </Providers>
  );
};

DetailModel.show = showDetail;

function showDetail(props: DetailModelProps) {
  console.log("show detail");
  const { onClose, ...reset } = props;
  const dom = document.createElement("div");
  const root = createRoot(dom);

  const close = () => {
    root.render(<DetailModel {...props} open={false} />);
  };

  root.render(
    <DetailModel
      {...reset}
      open
      onClose={(e, r) => {
        close();
        onClose?.(e, r);
      }}
      TransitionProps={{
        onExited() {
          root.unmount();
          dom.remove();
        },
      }}
    />
  );

  return close;
}
