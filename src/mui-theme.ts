import { createTheme } from "@mui/material";
// import { Quantico } from "next/font/google";
// const quantico = Quantico({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   style: ["normal", "italic"],
//   display: "swap",
// });

const muiTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === "small" && {
            fontSize: theme.typography.pxToRem(14), // 对于小尺寸按钮
            borderRadius: theme.typography.pxToRem(6),
          }),
          ...(ownerState.size === "medium" && {
            fontSize: theme.typography.pxToRem(16), // 对于中等尺寸按钮
            borderRadius: theme.typography.pxToRem(8),
          }),
          ...(ownerState.size === "large" && {
            fontSize: theme.typography.pxToRem(18), // 对于大尺寸按钮
            borderRadius: theme.typography.pxToRem(10),
          }),
          fontWeight: 700,
        }),
      },
    },
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        color: "primary",
        // disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          ".MuiDialog-container": {
            padding: 16,
          },
          ".MuiDialog-paper": {
            margin: 0,
            width: "100%",
          },
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#E90979",
    },
    secondary: {
      main: "#FAAB49",
    },
    background: {
      // paper: "rgb(34,34,34)",
      default: "#121212",
    },
  },
  typography: {
    // 设置全局默认字体
    fontFamily: `"Quantico", sans-serif`,
  },
});

export default muiTheme;
