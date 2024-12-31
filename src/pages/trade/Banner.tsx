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
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";

const items = [
  {
    title: `ASSASSINS SERIES
CHINESE ZODIAC`,
    subtitle: `Buy the first issue of SubLayer’s assassins series Zodiac Animals.`,
    src: "/banner-2.png",
  },
  {
    title: `MECH SERIES
RAIDER`,
    subtitle: `Buy the first issue of SubLayer’s Mech series RAIDER.`,
    src: "/banner-1.png",
  },
];
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
        autoplay
        autoplaySpeed={5000}
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
          <Item data={item} key={index} />
        ))}
      </Slider>
    </Box>
  );
};
export default Banner;

function Item({
  data,
}: {
  data: { title: string; subtitle: string; src: string };
}) {
  const navigate = useNavigate();
  return (
    <Box position="relative" width="100%" height="100%">
      {/* 背景 */}
      <Box
        position="absolute"
        style={{
          backgroundImage: `url(${data.src})`,
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
          {data.title}
        </Typography>
        <Hidden smDown>
          <Typography
            variant="body1"
            className="text-[#DADADA]"
            lineHeight={1.2}
            sx={{ mt: 1 }}
          >
            {data.subtitle}
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
            onClick={() => {
              navigate("/launchpad");
            }}
          >
            TO LAUNCHPAD
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
