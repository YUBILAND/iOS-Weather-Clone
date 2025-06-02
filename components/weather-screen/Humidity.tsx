import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";
import HumidityCard from "../humidity/HumidityCard";

interface HumidityProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Humidity = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: HumidityProps) => {
  const {
    collapseStyle: humidityCollapse,
    heightStyle: humidityHeight,
    removalOpacityStyle: humidityRemoval,
    layoutHeight: humidityLayoutHeight,
    onLayout: humidityOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(humidityLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={humidityOnLayout}
      layoutHeight={humidityLayoutHeight}
      heightAnimation={humidityHeight}
      removalAnimation={humidityRemoval}
    >
      <HumidityCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.humidity}
        collapseFromTopStyle={humidityCollapse}
      />
    </VisualHeightChange>
  );
};

export default Humidity;
