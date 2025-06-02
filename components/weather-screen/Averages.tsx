import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";
import AveragesCard from "../averages/AveragesCard";

interface AveragesProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Averages = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: AveragesProps) => {
  const {
    collapseStyle: averagesCollapse,
    heightStyle: averagesHeight,
    removalOpacityStyle: averagesRemoval,
    layoutHeight: averagesLayoutHeight,
    onLayout: averagesOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(averagesLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={averagesOnLayout}
      layoutHeight={averagesLayoutHeight}
      heightAnimation={averagesHeight}
      removalAnimation={averagesRemoval}
    >
      <AveragesCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.averages}
        collapseFromTopStyle={averagesCollapse}
      />
    </VisualHeightChange>
  );
};

export default Averages;
