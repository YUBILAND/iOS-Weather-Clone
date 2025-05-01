import { useEffect, useState } from "react";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useLayout } from "./useLayout";

export const getAnimatedStyles = (
  scrolledDownShared: SharedValue<number>,

  scrollTopMargin: number,
  gapLength: number,
  previousLayoutHeight: number,
  index: number
) => {
  const { layout, onLayout } = useLayout();
  const [layoutHeight, setLayoutHeight] = useState<number | null>(null);

  useEffect(() => {
    if (layout) {
      console.log("layout height is", layout.height);
      setLayoutHeight(layout.height);
    }
  }, [layout]);

  const oldTitleOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - Math.max(scrolledDownShared.value - 180, 0) / 10,
    };
  });
  const newTitleOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: Math.max(scrolledDownShared.value - 190, 0) / 10,
    };
  });

  const collapseStyle = useAnimatedStyle(() => {
    const collapseUp = -1;

    const scrollUntilNextElem =
      scrollTopMargin + gapLength * index + previousLayoutHeight;

    const offsetScrollToElem = Math.max(
      scrolledDownShared.value - scrollUntilNextElem,
      0
    );

    const collapseScrollOffset = collapseUp * offsetScrollToElem;

    // if (index === 0 && layoutHeight) console.log(collapseScrollOffset);

    return {
      transform: [
        {
          translateY: collapseScrollOffset,
        },
      ],
    };
  });

  const heightStyle = useAnimatedStyle(() => {
    const scrollUntilNextElem =
      scrollTopMargin + gapLength * index + previousLayoutHeight;

    // Prevent negative height values BEFORE reaching element
    const offsetScrollToElem = Math.max(
      scrolledDownShared.value - scrollUntilNextElem,
      0
    );
    // Prevent negative height values AFTER reaching element
    const heightScrollOffset = Math.max(
      (layoutHeight ?? 0) - offsetScrollToElem,
      0
    );

    return {
      ...(layoutHeight !== null
        ? {
            height: heightScrollOffset,
          }
        : {}),
      minHeight: 40,
    };
  });

  const removalOpacityStyle = useAnimatedStyle(() => {
    const startAsOpaque = 1;

    const scrollUntilNextElem =
      scrollTopMargin + gapLength * index + previousLayoutHeight;

    const scrollUntilStartRemove =
      scrollUntilNextElem + ((layoutHeight ?? 0) - 40);

    //  No negative before
    const offsetScrollToElem = Math.max(
      scrolledDownShared.value - scrollUntilStartRemove,
      0
    );

    const pixelDistanceForOpacityChange = 30;

    // Also no negative after
    const removalOpacityValue = Math.max(
      startAsOpaque - offsetScrollToElem / pixelDistanceForOpacityChange,
      0
    );

    return {
      opacity: removalOpacityValue,
    };
  });

  return {
    onLayout,
    layoutHeight,
    collapseStyle,
    heightStyle,
    removalOpacityStyle,
    oldTitleOpacityStyle,
    newTitleOpacityStyle,
  };
};
