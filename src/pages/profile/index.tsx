import React, { useState } from "react";
import Filter from "./components/Filter";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Collections from "./components/Collections";
import { Box, Button, Divider, Hidden, Paper, Stack } from "@mui/material";
import Activity from "./components/Activity";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Spacer from "@/components/Spacer";
import ProfileInfo from "./components/ProfileInfo";

export default function Profile() {
  const [value, setValue] = React.useState("1");
  const [showPanel, setShowPanel] = useState(false);

  return (
    <Stack direction="row" height="100%">
      <Hidden mdDown>
        <Box width={360} flexShrink={0}>
          <ProfileInfo />
          <Divider />
          <Filter />
        </Box>
      </Hidden>
      <Divider orientation="vertical" />
      <Box flex={1} overflow="hidden">
        <Stack
          flex={1}
          overflow="hidden"
          height="100%"
          sx={{
            ".MuiTabs-indicator": {
              height: 3,
            },
            ".MuiTab-root": {
              textTransform: "unset",
              fontSize: "1.13rem",
              px: 1,
            },

            ".MuiTabPanel-root": {
              p: 0,
              overflow: "hidden",
              height: "100%",
            },
          }}
        >
          <TabContext value={value}>
            <TabList
              onChange={(_, v) => {
                setValue(v);
              }}
              sx={{ px: 2 }}
            >
              <Tab label={"Collections"} value="1" disableRipple />

              <Tab label="Activity" value="2" disableRipple />
            </TabList>
            <Divider />
            <Box flex={1} overflow="hidden">
              <TabPanel value="1">
                <Collections />
              </TabPanel>
              <TabPanel value="2">
                <Activity />
              </TabPanel>
            </Box>
          </TabContext>
        </Stack>
        <Hidden mdUp>
          <Paper
            sx={{
              height: 420,
              position: "fixed",
              bottom: 0,
              width: "100%",
              transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
              transform: `translateY(${showPanel ? "0" : "348"}px)`,
            }}
          >
            <Box p={2}>
              <Stack direction="row" alignItems="center">
                <Spacer />
                <Button
                  variant="contained"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    minWidth: "unset",
                    padding: 0,
                    borderRadius: "3px",
                  }}
                  onClick={() => setShowPanel((v) => !v)}
                >
                  <ArrowDropUpIcon
                    sx={{
                      transform: `rotateX(${showPanel ? "180" : "0"}deg)`,
                    }}
                  />
                </Button>
              </Stack>
            </Box>
            <Divider />
            <Box flex={1} className="scroll">
              <Filter />
            </Box>
          </Paper>
        </Hidden>
      </Box>
    </Stack>
  );
}