import React from "react";
import { Box, IconButton, OutlinedInput } from "@mui/material";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

const Search: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: [1, 2, 3],
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).querySelector(
            "[name=keywords]"
          );
          let keywords = "";
          if (input) {
            keywords = (input as HTMLInputElement).value;
          }
          console.log("search :", keywords);
        }}
        inputMode="search"
        style={{ height: "100%" }}
      >
        <OutlinedInput
          fullWidth
          name="keywords"
          placeholder="Search collections"
          size="small"
          sx={{
            pr: 0.5,
            fontSize: "0.875rem",
            height: "100%",
            input: { py: 0 },
          }}
          endAdornment={
            <IconButton
              type="submit"
              size="small"
              disableRipple
              aria-label="search"
            >
              <SearchOutlined />
            </IconButton>
          }
        />
      </form>
    </Box>
  );
};
export default Search;
