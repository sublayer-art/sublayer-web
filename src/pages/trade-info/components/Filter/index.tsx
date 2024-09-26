import NumberInput from "@/components/NumberInput";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import React from "react";

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

const Filter: React.FC = () => {
  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight={700}>
        Filters
      </Typography>
      <Box mt={3}>
        <Typography mb={1.5}>Price Range</Typography>
        <Stack direction="row" alignItems="center">
          <NumberInput decimal={2} placeholder="Min" min={0} />
          <Box mx={2} width={16} height="2px" bgcolor="#747f8b" />
          <NumberInput decimal={2} placeholder="Max" />
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
    </Box>
  );
};
export default Filter;
