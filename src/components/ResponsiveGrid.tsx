import { FixedSizeGrid as Grid } from "react-window";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, CircularProgress } from "@mui/material";
import throttle from "lodash/throttle";
import Center from "./Center";

const DefaultLoader = () => (
  <Center expanded>
    <CircularProgress size={22} />
  </Center>
);

const ResponsiveGrid: React.FC<{
  itemsCount: number;
  itemWidth: number;
  itemBuilder: (index: number) => React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => Promise<void>;
  loadingIndicator?: React.ReactNode;
}> = ({
  itemsCount,
  onLoadMore,
  itemWidth = 200,
  itemBuilder,
  hasMore,
  loadingIndicator = <DefaultLoader />,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect>();

  const initSize = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setContainerRect(rect);
    }
  }, []);

  useEffect(() => {
    initSize();
    const handleResize = () => {
      requestAnimationFrame(initSize);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initSize]);

  const [loading, setLoading] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore || !onLoadMore) return;
    setLoading(true);
    onLoadMore().finally(() => setLoading(false));
  }, [loading, hasMore]);

  const throttleedLoadMore = throttle(handleLoadMore, 1000);

  const columnCount = useMemo(
    () =>
      containerRect
        ? Math.max(Math.floor(containerRect.width / itemWidth), 2)
        : 0,
    [containerRect, itemWidth]
  );

  const rowCount = useMemo(() => {
    if (columnCount && itemsCount) {
      const rowCount =
        itemsCount % columnCount === 0
          ? itemsCount / columnCount + (hasMore ? 1 : 0)
          : Math.ceil(itemsCount / columnCount);

      return rowCount;
    }
    return 0;
  }, [columnCount, itemsCount, hasMore]);

  const columnWidth = useMemo(
    () =>
      containerRect && columnCount ? containerRect.width / columnCount : 0,
    [containerRect, columnCount]
  );

  return (
    <Box px={1.5} width="100%" height="100%">
      <Box ref={containerRef} width="100%" height="100%">
        {containerRect && (
          <>
            <Grid
              width={containerRect.width}
              height={containerRect.height}
              columnCount={columnCount}
              columnWidth={columnWidth}
              rowCount={rowCount}
              rowHeight={columnWidth / 0.75 + 76}
              useIsScrolling
              onItemsRendered={(props: any) => {
                if (props.visibleRowStopIndex === rowCount - 1) {
                  throttleedLoadMore();
                }
              }}
            >
              {({ columnIndex, rowIndex, style }: any) => {
                const index = rowIndex * columnCount + columnIndex;
                if (index >= itemsCount) {
                  if (hasMore) {
                    return (
                      <Box style={style} p={0.75}>
                        {loadingIndicator}
                      </Box>
                    );
                  }
                  return null;
                }
                return (
                  <Box style={style} p={0.75}>
                    {itemBuilder(index)}
                  </Box>
                );
              }}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ResponsiveGrid;
