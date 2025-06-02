import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { iconSize } from "./utils/constants";
import WindChillCard from "../wind-chill/WindChillCard";

interface FeelsLikeProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const FeelsLike = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: FeelsLikeProps) => {
  const {
    collapseStyle: feelsLikeCollapse,
    heightStyle: feelsLikeHeight,
    removalOpacityStyle: feelsLikeRemoval,
    layoutHeight: feelsLikeLayoutHeight,
    onLayout: feelsLikeOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(feelsLikeLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={feelsLikeOnLayout}
      layoutHeight={feelsLikeLayoutHeight}
      heightAnimation={feelsLikeHeight}
      removalAnimation={feelsLikeRemoval}
    >
      <WindChillCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.feelsLike}
        collapseFromTopStyle={feelsLikeCollapse}
      />
    </VisualHeightChange>
  );
};

export default FeelsLike;
