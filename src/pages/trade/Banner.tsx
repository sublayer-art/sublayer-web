import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Hidden,
  IconButton,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";

const items = ["/banner-2.png", "/banner-1.jpg"];
const Banner: React.FC = () => {
  function PrevArrow(props: any) {
    return (
      <IconButton
        sx={{
          position: "absolute",
          top: "50%",
          left: [0, 8, 24],
          zIndex: 1,
          transform: "translate(0, -50%)",
        }}
        onClick={props.onClick}
      >
        <ArrowBackIos />
      </IconButton>
    );
  }
  function NextArrow(props: any) {
    return (
      <IconButton
        sx={{
          position: "absolute",
          top: "50%",
          right: [0, 8, 24],
          zIndex: 1,
          transform: "translate(0, -50%)",
        }}
        onClick={props.onClick}
      >
        <ArrowForwardIos />
      </IconButton>
    );
  }

  const matchSM = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  return (
    <Box
      component={Container}
      style={{ padding: 0 }}
      sx={{
        padding: 0,
        height: [160, 280, 430],
        ".slick-slider": {
          height: "100%",
          ".slick-list, .slick-track, .slick-slide, .slick-slide > div": {
            height: "100%",
          },
        },
      }}
    >
      <Slider
        dots
        infinite
        speed={500}
        arrows={!matchSM}
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
        appendDots={(dots) => {
          return (
            <Box
              component={"ul"}
              sx={{
                position: "absolute",
                width: "100%",
                bottom: 0,
                padding: 0,
                my: 1,
                listStyle: "none",
                // pointerEvents: "none",
                display: "flex !important",
                alignItems: "center",
                justifyContent: "center",

                ".slick-active > div": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              {dots}
            </Box>
          );
        }}
        customPaging={() => {
          return (
            <Box
              sx={{
                width: 8,
                height: 8,
                mx: 0.8,
                borderRadius: 4,
                backgroundColor: "#ddd",
              }}
            ></Box>
          );
        }}
      >
        {items.map((item, index) => (
          <Item image={item} key={index} />
        ))}
      </Slider>
    </Box>
  );
};
export default Banner;

function Item(props: { image: string }) {
  return (
    <Box position="relative" width="100%" height="100%">
      {/* 背景 */}
      <Box
        position="absolute"
        style={{
          backgroundImage: `url(${props.image})`,
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
          }}
        ></div>
      </Box>
      {/* 内容 */}
      <Stack
        px={[2, 3, 5]}
        pb={[2, undefined, 3]}
        height="100%"
        justifyContent="end"
      >
        <Typography
          variant="h3"
          sx={{ fontSize: ["1.2rem", "2rem", "3rem"] }}
          fontWeight="bold"
          lineHeight={1.2}
        >
          Liberty Square Originz: Embers
        </Typography>
        <Hidden smDown>
          <Typography
            variant="body1"
            className="text-[#DADADA]"
            lineHeight={1.2}
            sx={{ mt: 1 }}
          >
            Buy the first issue of Liberty Square’s gritty comic series Originz:
            Embers.
          </Typography>
        </Hidden>

        <Box mt={[1, 2, 4]}>
          <Button
            variant="contained"
            sx={{
              height: [32, 38, 48],
              px: [1, 1.5, 3],
              fontSize: [12, 14, 16],
            }}
          >
            TO LAUNCHPAD
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
