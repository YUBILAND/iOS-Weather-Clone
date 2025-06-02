import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import SunPhaseCard from "../sun-phase/SunPhaseCard";
import { iconSize } from "./utils/constants";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";

interface SunProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Sun = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: SunProps) => {
  const {
    collapseStyle: sunCollapse,
    heightStyle: sunHeight,
    removalOpacityStyle: sunRemoval,
    layoutHeight: sunLayoutHeight,
    onLayout: sunOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(sunLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={sunOnLayout}
      layoutHeight={sunLayoutHeight}
      heightAnimation={sunHeight}
      removalAnimation={sunRemoval}
    >
      <SunPhaseCard
        graphHeight={60}
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.sunPhase}
        collapseFromTopStyle={sunCollapse}
      />
    </VisualHeightChange>
  );
};

export default Sun;
