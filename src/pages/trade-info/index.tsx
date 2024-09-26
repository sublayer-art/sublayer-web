import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useLocation, useParams } from "react-router-dom";
import { useRequest } from "ahooks";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Spacer from "@/components/Spacer";
import BatchOperations from "./components/BatchOperations";
import CustomTab from "@/components/CustomTab";
import ContractService, { ContractDTO } from "@/services/contract";

export default function TradeInfo() {
  const { caddress } = useParams();
  const locat = useLocation();
  const pageSize = 1000;

  const [details, setDetails] = useState<ContractDTO>();
  const req = useRequest(ContractService.info, { manual: true });

  useEffect(() => {
    if (locat?.state?.data) {
      setDetails(locat.state.data);
    } else if (caddress) {
      req.runAsync(caddress!).then(setDetails);
    }
  }, [caddress, locat]);

  const [value, setValue] = React.useState("1");
  const [txType, setTxType] = useState<TransactionType>("buy");

  const [buyState, setBuyState] = useState<StateOfTransactionType>({
    items: [],
    loading: true,
    hasMore: true,
    currentPage: 1,
    selectedItems: [],
  });

  const [sellState, setSellState] = useState<StateOfTransactionType>({
    items: [],
    loading: true,
    hasMore: true,
    currentPage: 1,
    selectedItems: [],
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

  const onSelectItem = useCallback(
    (item: any, txType: TransactionType = "buy") => {
      if (txType === "buy") {
        const idx = buyState.selectedItems.findIndex((v) => v === item);
        if (idx >= 0) {
          buyState.selectedItems.splice(idx, 1);
        } else {
          buyState.selectedItems.push(item);
        }
        setBuyState({ ...buyState });
      } else {
        const idx = sellState.selectedItems.findIndex((v) => v === item);
        if (idx >= 0) {
          sellState.selectedItems.splice(idx);
        } else {
          sellState.selectedItems.push(item);
        }
        setSellState({ ...sellState });
      }
    },
    [buyState, sellState]
  );

  const onSliderChange = useCallback(
    (value: number) => {
      if (txType === "buy") {
        const { selectedItems, items } = buyState;
        const pasedV = parseInt(value + "");
        if (selectedItems.length === pasedV) return;
        if (selectedItems.length < pasedV) {
          let sLen = selectedItems.length;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!selectedItems.includes(item)) {
              selectedItems.push(item);
              sLen++;
            }
            if (sLen === pasedV) break;
          }
        } else {
          // 按 items 顺序从后向前删除已选择的 item
          for (let i = items.length - 1; i >= 0; i--) {
            const idx = selectedItems.indexOf(items[i]);
            if (idx >= 0) {
              selectedItems.splice(idx, 1);
            }
            if (selectedItems.length === value) break;
          }
        }
        setBuyState({ ...buyState });
      }
    },
    [txType, buyState]
  );

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
        collectionData: details,
        transactionType: txType,
        buyState,
        sellState,
        onSelectItem,
        onSliderChange,
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
            <BatchOperations />
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
                  // transform: `translateY(${showPanel ? "0" : "348"}px)`,
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
                <Box flex={1} className="scroll">
                  <BatchOperations />
                </Box>
              </Paper>
            </Hidden>
          </Stack>
        </Box>
      </Stack>
    </CollectionTradeContext.Provider>
  );
}
