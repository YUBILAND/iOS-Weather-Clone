import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import WindCard from "../wind-forecast/card/WindCard";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";

interface WindProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Wind = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: WindProps) => {
  const {
    collapseStyle: windCollapse,
    heightStyle: windHeight,
    removalOpacityStyle: windRemoval,
    layoutHeight: windLayoutHeight,
    onLayout: windOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(windLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={windOnLayout}
      layoutHeight={windLayoutHeight}
      heightAnimation={windHeight}
      removalAnimation={windRemoval}
    >
      <WindCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.wind}
        collapseFromTopStyle={windCollapse}
      />
    </VisualHeightChange>
  );
};

export default Wind;
