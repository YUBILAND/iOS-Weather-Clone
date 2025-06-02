import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { getSumOfArray } from "./utils/helperFunctions";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import AirQualityCard from "../air-quality/AirQualityCard";
import { iconSize } from "./utils/constants";

interface QualityProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Quality = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: QualityProps) => {
  const {
    collapseStyle: airQualityCollapse,
    heightStyle: airQualityHeight,
    removalOpacityStyle: airQualityRemoval,
    layoutHeight: airQualityLayoutHeight,
    onLayout: airQualityOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(airQualityLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={airQualityOnLayout}
      layoutHeight={airQualityLayoutHeight}
      heightAnimation={airQualityHeight}
      removalAnimation={airQualityRemoval}
    >
      <AirQualityCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.airQuality}
        collapseFromTopStyle={airQualityCollapse}
      />
    </VisualHeightChange>
  );
};

export default Quality;
