import React, { useCallback, useEffect, useState } from "react";
import Filter from "./components/Filter";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TradeItems from "./components/TradeItems";
import InventoryItems from "./components/InventoryItems";
import {
  CollectionTradeContext,
  StateOfTransactionType,
  TransactionType,
} from "./context";

import {
  Box,
  Button,
  Divider,
  Hidden,
  Paper,
  Stack,
  Tabs,
} from "@mui/material";
import CollectionInfo from "./components/CollectionInfo";
import Activity from "./components/Activity";
import { useParams } from "react-router-dom";
import { useRequest } from "ahooks";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Spacer from "@/components/Spacer";
import CustomTab from "@/components/CustomTab";
import ContractService, { ContractDTO } from "@/services/contract";

export default function TradeInfo() {
  const { caddress } = useParams();
  const pageSize = 1000;

  const req = useRequest(ContractService.info, {
    defaultParams: [caddress!],
  });

  const data = req.data as ContractDTO;

  const [value, setValue] = React.useState("1");
  const [txType, setTxType] = useState<TransactionType>("buy");

  const [buyState, setBuyState] = useState<StateOfTransactionType>({
    items: [],
    loading: true,
    hasMore: true,
    currentPage: 1,
  });

  const [sellState, setSellState] = useState<StateOfTransactionType>({
    items: [],
    loading: true,
    hasMore: true,
    currentPage: 1,
  });

  const buyStateReq = useRequest(ContractService.listItems, {
    manual: true,
  });

  const reload = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (!caddress) return reject("contract address can not be null");
      if (txType === "buy") {
        setBuyState((v) => ({ ...v, loading: true }));
        buyStateReq
          .runAsync({
            address: caddress,
            isSell: true,
          })
          .then(({ records }) => {
            const hasMore = records.length === pageSize;
            setBuyState((v) => ({
              ...v,
              items: records,
              loading: false,
              hasMore,
            }));

            resolve();
          });
      }
    });
  }, [caddress, txType]);

  const loadItems = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (!caddress) return reject("contract address can not be null");
      if (txType === "buy") {
        if (buyState.hasMore) {
          const pageNumber = buyState.currentPage + 1;
          setBuyState((v) => ({ ...v, loading: true, pageNumber }));
          buyStateReq
            .runAsync({
              address: caddress,
              isSell: true,
            })
            .then(({ records }) => {
              const items: any[] = [];
              items.push(...buyState.items);
              const hasMore = records.length === pageSize;
              setBuyState((v) => ({
                ...v,
                items: [...buyState.items, ...records],
                loading: false,
                hasMore,
              }));

              resolve();
            });
        }
      }
    });
  }, [caddress, txType, buyState]);


  useEffect(() => {
    reload();
  }, []);

  const [showPanel, setShowPanel] = useState(false);

  const onTransactionTypeChange = (v: TransactionType) => {
    setTxType(v);
    setSellState((v) => ({ ...v, selectedItems: [] }));
    setBuyState((v) => ({ ...v, selectedItems: [] }));
  };

  return (
    <CollectionTradeContext.Provider
      value={{
        collectionData: data,
        transactionType: txType,
        buyState,
        sellState,
        loadItems,
      }}
    >
      <Stack direction="row" height="100%">
        <Hidden mdDown>
          <Box width={360} flexShrink={0}>
            <Box p={2}>
              <Tabs
                value={txType}
                variant="fullWidth"
                onChange={(_, v) => {
                  onTransactionTypeChange(v);
                }}
                sx={{
                  ".MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <CustomTab label="Buy" value="buy" />
                <CustomTab label="Sell" value="sell" />
              </Tabs>
            </Box>
            <Divider />
            <Filter />
          </Box>
        </Hidden>
        <Divider orientation="vertical" />
        <Box flex={1} overflow="hidden">
          <Stack height="100%">
            <CollectionInfo />
            <Divider />
            <Stack
              flex={1}
              overflow="hidden"
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
                  <Tab
                    label={txType === "buy" ? "Trade" : "Inventory"}
                    value="1"
                    disableRipple
                  />

                  <Tab label="Activity" value="2" disableRipple />
                </TabList>
                <Divider />
                <Box flex={1} overflow="hidden">
                  <TabPanel value="1">
                    {txType === "buy" ? <TradeItems /> : <InventoryItems />}
                  </TabPanel>
                  <TabPanel value="2">
                    <Activity />
                  </TabPanel>
                </Box>
                <Hidden mdUp>
                  <div style={{ height: 72 }}></div>
                </Hidden>
              </TabContext>
            </Stack>
            <Hidden mdUp>
              <Paper
                sx={{
                  height: 420,
                  position: "fixed",
                  bottom: showPanel ? 0 : -348,
                  width: "100vw",
                  transition: "bottom 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                }}
              >
                <Box p={2}>
                  <Stack direction="row" alignItems="center">
                    <Tabs
                      value={txType}
                      onChange={(_, v) => {
                        onTransactionTypeChange(v);
                      }}
                      sx={{
                        minHeight: "unset",
                        ".MuiTabs-indicator": {
                          display: "none",
                        },

                        'button[role="tab"]': {
                          fontSize: "1rem",
                          padding: "5px 15px",
                          height: 40,
                          minWidth: 120,
                          minHeight: "unset",
                        },
                      }}
                    >
                      <CustomTab label="Buy" value="buy" />
                      <CustomTab label="Sell" value="sell" />
                    </Tabs>
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
                <Filter />
              </Paper>
            </Hidden>
          </Stack>
        </Box>
      </Stack>
    </CollectionTradeContext.Provider>
  );
}
