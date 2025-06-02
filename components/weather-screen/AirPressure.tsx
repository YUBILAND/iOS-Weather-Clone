import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";
import AirPressureCard from "../air-pressure/AirPressureCard";

interface AirPressureProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const AirPressure = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: AirPressureProps) => {
  const {
    collapseStyle: airPressureCollapse,
    heightStyle: airPressureHeight,
    removalOpacityStyle: airPressureRemoval,
    layoutHeight: airPressureLayoutHeight,
    onLayout: airPressureOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(airPressureLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={airPressureOnLayout}
      layoutHeight={airPressureLayoutHeight}
      heightAnimation={airPressureHeight}
      removalAnimation={airPressureRemoval}
    >
      <AirPressureCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.airPressure}
        collapseFromTopStyle={airPressureCollapse}
      />
    </VisualHeightChange>
  );
};

export default AirPressure;
