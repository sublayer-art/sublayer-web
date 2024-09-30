import { Box, Container } from "@mui/material";
import MintTable from "./MintTable";
import Banner from "../trade/Banner";

export default function mint() {
  return (
    <Box height="100%" className="scroll">
      <Banner />
      <Container>
        <MintTable />
      </Container>
    </Box>
  );
}
