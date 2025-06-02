import {
  gapLength,
  scrollTopMargin,
} from "@/components/weather-screen/utils/constants";
import { useLayoutHeight } from "@/components/weather-screen/utils/useLayoutHeight";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

export const getAnimatedStyles = (
  scrolledDownShared: SharedValue<number>,
  previousLayoutHeight: number,
  index: number
) => {
  const { onLayout, layoutHeight } = useLayoutHeight();

  const oldTitleOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity:
        1 -
        Math.max(
          scrolledDownShared.value -
            (180 + index * gapLength) -
            previousLayoutHeight,
          0
        ) /
          10,
    };
  });
  const newTitleOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity:
        Math.max(
          scrolledDownShared.value -
            (190 + index * gapLength) -
            previousLayoutHeight,
          0
        ) / 10,
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

    // if (index === 2 && layoutHeight) console.log(collapseScrollOffset);

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
