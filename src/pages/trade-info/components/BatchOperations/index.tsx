import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useCollectionTradeContext } from "../../context";
import NumberInput from "@/components/NumberInput";

const BatchOperations: React.FC = () => {
  const { transactionType, buyState, sellState, onSliderChange } =
    useCollectionTradeContext();
  const selectedCount = useMemo(() => {
    if (transactionType === "buy") {
      return buyState.selectedItems.length;
    } else {
      return sellState.selectedItems.length;
    }
  }, [
    buyState.selectedItems.length,
    sellState.selectedItems.length,
    transactionType,
  ]);

  const totalCount = useMemo(() => {
    if (transactionType === "buy") {
      return buyState.items.length;
    } else {
      return sellState.items.length;
    }
  }, [buyState.items.length, sellState.items.length, transactionType]);

  const min = 0,
    max = Math.min(50, totalCount);

  return (
    <Box p={2}>
      <Typography lineHeight={1} sx={{ fontWeight: 700 }}>
        {transactionType === "buy" ? " NFTS TO BUY" : " NFTS TO SELL"}
      </Typography>
      <Stack direction="row" alignItems="end">
        <Slider
          min={min}
          max={max}
          valueLabelDisplay="off"
          value={selectedCount}
          onChange={(_, v) => {
            onSliderChange(v as number);
          }}
          sx={{ mb: 0.5 }}
        />
        <NumberInput
          value={selectedCount}
          sx={{ ml: 3 }}
          min={min}
          max={max}
          onChange={(value) => {
            console.log("on slider change:", value);
            onSliderChange(value ?? 0);
          }}
        />
      </Stack>
      {transactionType === "buy" ? (
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3, borderRadius: "99px", textTransform: "unset" }}
        >
          Sweep {selectedCount} items
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3, borderRadius: "99px", textTransform: "unset" }}
        >
          List {selectedCount} items
        </Button>
      )}
    </Box>
  );
};
export default BatchOperations;
