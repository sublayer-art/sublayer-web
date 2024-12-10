import NumberInput from "@/components/NumberInput";
import { eth2Wei } from "@/tools/eth-tools";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const rarityOptions = [
  {
    name: "Uncommon",
    value: "Uncommon",
    desc: "≤ 60%",
    level: 5,
  },
  {
    name: "Rare",
    value: "Rare",
    desc: "≤ 35%",
    level: 4,
  },
  {
    name: "Epic",
    value: "Epic",
    desc: "≤ 15%",
    level: 3,
  },
  {
    name: "Legendary",
    value: "Legendary",
    desc: "≤ 5%",
    level: 2,
  },
  {
    name: "Mythic",
    value: "Mythic",
    desc: "≤ 1%",
    level: 1,
  },
];

const Filter: React.FC<{
  onFilter?: (params: Record<string, any>) => void;
}> = (props) => {
  const { onFilter } = props;
  const [searchParams, setSearchParams] = useState<{
    min?: number;
    max?: number;
  }>({});

  return (
    <Box component="form" p={2}>
      <Typography variant="h6" fontWeight={700}>
        Filters
      </Typography>
      <Box mt={3}>
        <Typography mb={1.5}>Price Range</Typography>
        <Stack direction="row" alignItems="center">
          <NumberInput
            decimal={2}
            name="min"
            placeholder="Min"
            min={0}
            value={searchParams.min}
            onChange={(value) => {
              setSearchParams({
                ...searchParams,
                min: value,
              });
            }}
          />
          <Box mx={2} width={16} height="2px" bgcolor="#747f8b" />
          <NumberInput
            decimal={2}
            name="max"
            placeholder="Max"
            value={searchParams.max}
            onChange={(value) => {
              setSearchParams({
                ...searchParams,
                max: value,
              });
            }}
          />
        </Stack>
      </Box>
      <Box mt={3}>
        <Typography mb={1.5}>Rarity</Typography>
        <Select<string>
          fullWidth
          size="small"
          displayEmpty
          renderValue={(value) => {
            if (value) {
              return value;
            }
            // placeholder
            return (
              <Typography color="gray">Choose a max rarity level</Typography>
            );
          }}
          placeholder="Choose a max rarity level"
          MenuProps={{
            sx: {
              ".MuiPaper-root": {
                backgroundColor: "background.default",
                backgroundImage: "unset",
                marginTop: "10px",
                border: "solid 1px rgba(255, 255, 255, 0.12)",
              },
            },
          }}
        >
          {rarityOptions.map((opt, index) => {
            const levelColors: Record<number, string> = {
              5: "#1B8368",
              4: "#2562E8",
              3: "#6317CD",
              2: "#CEA501",
              1: "#E8395E",
            };
            return (
              <MenuItem
                value={opt.value}
                key={index}
                disableRipple
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "unset",
                    ".icon": {
                      backgroundColor: "primary.main",
                    },
                  },
                }}
              >
                <Box
                  className="icon"
                  sx={{
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "50%",
                    backgroundColor: "#1F2127",
                    mr: 1,
                  }}
                ></Box>
                <Typography color="#747F8B">{opt.name}</Typography>
                <Typography ml={1} fontSize={10} color={levelColors[opt.level]}>
                  {opt.desc}
                </Typography>
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Stack mt={10} direction="row" spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setSearchParams({});
            onFilter?.({});
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            onFilter?.({
              min: searchParams.min ? eth2Wei(searchParams.min) : undefined,
              max: searchParams.max ? eth2Wei(searchParams.max) : undefined,
            });
          }}
        >
          Search
        </Button>
      </Stack>
    </Box>
  );
};
export default Filter;
