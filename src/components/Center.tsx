import { Stack, SxProps } from "@mui/material";
import React, { PropsWithChildren } from "react";

const Center: React.FC<
  PropsWithChildren<{ expanded?: boolean; sx?: SxProps }>
> = ({ children, expanded = false, sx }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 2,
        ...sx,
        ...(expanded ? { width: "100%", height: "100%" } : {}),
      }}
    >
      {children}
    </Stack>
  );
};
export default Center;
