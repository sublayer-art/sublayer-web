import { colorWithOpacity } from "@/tools/style";
import { Tab, TabProps, styled } from "@mui/material";

const CustomTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    fontWeight: 700,
    border: "solid 1px rgb(42, 46, 57)",
    color: "rgb(116, 127, 139)",
    fontSize: 18,
    "&[aria-selected=true]": {
      borderColor: theme.palette.primary.main,
      borderWidth: "1px !important",
      color: "#fff",
      backgroundColor: colorWithOpacity(theme.palette.primary.main, 0.3),

      "& + .MuiTab-root": {
        borderLeftWidth: 0,
      },
    },

    "&:not(:last-child)": {
      borderRightWidth: 0,
    },
  })
);

export default CustomTab;
