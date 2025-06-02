import { View, Text } from "react-native";
import React, { ForwardedRef, MutableRefObject, useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import DailyForecastCard from "../daily-forecast/DailyForecastCard";
import { iconSize } from "./utils/constants";
import { getSumOfArray } from "./utils/helperFunctions";

interface DailyProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  setCurrentIndex: (index: number) => void;
  openModalOnIndexRef: MutableRefObject<boolean>;
  scrollOffset: number;
  index: number;
}
const Daily = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  setCurrentIndex,
  openModalOnIndexRef,
  scrollOffset,
  index,
}: DailyProps) => {
  const {
    collapseStyle: dailyCollapse,
    heightStyle: dailyHeight,
    removalOpacityStyle: dailyRemoval,
    layoutHeight: dailyLayoutHeight,
    onLayout: dailyOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(dailyLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={dailyOnLayout}
      layoutHeight={dailyLayoutHeight}
      heightAnimation={dailyHeight}
      removalAnimation={dailyRemoval}
    >
      <DailyForecastCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.dayCondition}
        setCurrentIndex={setCurrentIndex}
        openModalOnIndexRef={openModalOnIndexRef}
        collapseFromTopStyle={dailyCollapse}
      />
    </VisualHeightChange>
  );
};

export default Daily;
