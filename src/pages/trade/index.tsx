import { Box, Container } from "@mui/material";
import TradeTable from "./TradeTable";
import Banner from "./Banner";



export default function Trade() {
  return (
    <Box height="100%" className="scroll hide-scrollbar">
      <Banner />
      <Container>
        <TradeTable />
      </Container>
    </Box>
  );
}
