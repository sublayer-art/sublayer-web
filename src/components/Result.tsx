import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import Center from "./Center";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

type ResultType = "success" | "error" | "warn";

export type ResultProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  type?: ResultType;
};

const icons: Record<ResultType, React.ReactNode> = {
  success: (
    <CheckCircleRoundedIcon color="success" sx={{ fontSize: "inherit" }} />
  ),
  error: <ErrorRoundedIcon color="error" sx={{ fontSize: "inherit" }} />,
  warn: <WarningRoundedIcon color="warning" sx={{ fontSize: "inherit" }} />,
};

const titles: Record<ResultType, string> = {
  success: "操作成功",
  error: "操作失败",
  warn: "警告",
};

const Result: React.FC<ResultProps> = (props) => {
  const { icon, title, subtitle, extra, type = "success" } = props;

  const finalIcon = icon || icons[type];
  const finalTitle = title || titles[type];

  return (
    <Center sx={{ py: 6 }}>
      <Stack alignItems="center" width="100%" maxWidth="200px">
        <Center
          sx={{
            width: 80,
            height: 80,
            p: 1,
            fontSize: 48,
          }}
        >
          {finalIcon}
        </Center>
        <Typography fontWeight="500">{finalTitle}</Typography>
        {subtitle && (
          <Typography
            mt={0.5}
            variant="caption"
            color="rgba(255, 255, 255, 0.75)"
          >
            {subtitle}
          </Typography>
        )}
        {extra && <Box mt={1.5}>{extra}</Box>}
      </Stack>
    </Center>
  );
};
export default Result;
