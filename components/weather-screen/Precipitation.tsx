import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";
import PrecipitationCard from "../precipitation/PrecipitationCard";

interface PrecipitationProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Precipitation = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: PrecipitationProps) => {
  const {
    collapseStyle: precipitationCollapse,
    heightStyle: precipitationHeight,
    removalOpacityStyle: precipitationRemoval,
    layoutHeight: precipitationLayoutHeight,
    onLayout: precipitationOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(precipitationLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={precipitationOnLayout}
      layoutHeight={precipitationLayoutHeight}
      heightAnimation={precipitationHeight}
      removalAnimation={precipitationRemoval}
    >
      <PrecipitationCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.precipitation}
        collapseFromTopStyle={precipitationCollapse}
      />
    </VisualHeightChange>
  );
};

export default Precipitation;
