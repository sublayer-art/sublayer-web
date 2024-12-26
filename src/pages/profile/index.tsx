import React, { useEffect } from "react";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Collections from "./components/Collections";
import { Box, Divider, Hidden, Stack } from "@mui/material";
import ProfileInfo from "./components/ProfileInfo";
import ListedCollections from "./components/Listed";
import CreatedCollections from "./components/Created";
import { useRequest } from "ahooks";
import UserService from "@/services/user";
import ProfileContext from "./context";
import { useAccount } from "wagmi";

export default function Profile() {
  const [value, setValue] = React.useState("1");
  const collectionReq = useRequest(UserService.collectionList, {
    manual: true,
    pollingInterval: 5000,
  });
  const listedReq = useRequest(UserService.onSales, {
    manual: true,
    pollingInterval: 5000,
  });
  const createdReq = useRequest(UserService.createdList, {
    manual: true,
  });

  const { address } = useAccount();
  useEffect(() => {
    if (address) {
      collectionReq.run({ address });
      listedReq.run({ address });
      createdReq.run({ address });
    }
  }, [address]);

  return (
    <ProfileContext.Provider value={{ collectionReq, listedReq, createdReq }}>
      <Stack direction="row" height="100%">
        <Hidden mdDown>
          <Box width={360} flexShrink={0}>
            <ProfileInfo />
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
                <Tab label="My NFTs" value="1" disableRipple />
                <Tab label="Listed" value="2" disableRipple />
                <Tab label="Created" value="3" disableRipple />
              </TabList>
              <Divider />
              <Box flex={1} overflow="hidden">
                <TabPanel value="1">
                  <Collections />
                </TabPanel>
                <TabPanel value="2">
                  <ListedCollections />
                </TabPanel>
                <TabPanel value="3">
                  <CreatedCollections />
                </TabPanel>
              </Box>
            </TabContext>
          </Stack>
        </Box>
      </Stack>
    </ProfileContext.Provider>
  );
}
