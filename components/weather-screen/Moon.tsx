import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";
import MoonPhaseCard from "../moon-phase/MoonPhaseCard";
import { getDaysSincePrevMonth } from "../moon-phase/utils/getDaysSincePrevMonth";
import { TICKS_PER_DAY } from "../moon-phase/utils/constants";
import { getCurrentMoonPhase } from "../moon-phase/utils/getCurrentMoonPhase";
import { useWeatherData } from "@/hooks/useWeatherData";
import { getInitialScrollIndex } from "../moon-phase/utils/getInitialScrollIndex";

interface MoonProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Moon = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: MoonProps) => {
  const data = useWeatherData();
  const {
    collapseStyle: moonCollapse,
    heightStyle: moonHeight,
    removalOpacityStyle: moonRemoval,
    layoutHeight: moonLayoutHeight,
    onLayout: moonOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(moonLayoutHeight ?? 0);

  const { initialScrollIndex } = getInitialScrollIndex();

  const initialMoonPhase = getCurrentMoonPhase(
    data[cityName],
    initialScrollIndex,
    initialScrollIndex
  );

  return (
    <VisualHeightChange
      onLayout={moonOnLayout}
      layoutHeight={moonLayoutHeight}
      heightAnimation={moonHeight}
      removalAnimation={moonRemoval}
    >
      <MoonPhaseCard
        cityName={cityName}
        iconSize={iconSize}
        userScrolledIndex={initialScrollIndex}
        currentMoonPhase={initialMoonPhase}
        initialScrollIndex={initialScrollIndex}
        showModal={modalCallbacks.moonPhase}
        collapseFromTopStyle={moonCollapse}
      />
    </VisualHeightChange>
  );
};

export default Moon;
