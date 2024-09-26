import Providers from "@/providers";
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
  console.log({ data });
  return (
    <Providers>
      <Dialog {...reset} open={open} maxWidth="lg" fullWidth>
        <Box sx={{ px: 3, py: 4, minHeight: "40vh", maxHeight: "80vh" }}>
          <Stack direction={["column", "column", "row"]} gap={2}>
            <Box
              component="img"
              src={data.goodsImage}
              alt=""
              sx={{ flex: 1, borderRadius: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Stack direction="row">
                <Typography variant="h4" fontWeight="700">
                  {data.goodsItemName}
                </Typography>
              </Stack>
            </Box>
          </Stack>
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
