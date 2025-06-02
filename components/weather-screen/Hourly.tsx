import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import HourlyForecastCard from "../hourly-forecast/HourlyForecastCard";
import Animated, { SharedValue } from "react-native-reanimated";
import { gapLength, iconSize, scrollTopMargin } from "./utils/constants";
import DefaultText from "../atoms/DefaultText";
import CardTitle from "../atoms/CardTitle";
import { CalendarDaysIcon } from "react-native-heroicons/outline";

interface HourlyProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}
const Hourly = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: HourlyProps) => {
  const {
    collapseStyle: hourlyCollapse,
    heightStyle: hourlyHeight,
    removalOpacityStyle: hourlyRemoval,
    oldTitleOpacityStyle,
    newTitleOpacityStyle,
    layoutHeight: hourlyLayoutHeight,
    onLayout: hourlyOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  //   Adds Layout Height to Array
  if (addCardLayoutHeight) addCardLayoutHeight(hourlyLayoutHeight ?? 0);

  const memoizedHourlyTitle = useMemo(
    () => (
      <>
        <Animated.View
          className="flex-row ml-2 px-4"
          style={oldTitleOpacityStyle}
        >
          <DefaultText>
            {"It looks to be clear. Expect windy conditions at 10:00"}
          </DefaultText>
        </Animated.View>
        <Animated.View
          className="px-4 ml-2 absolute top-0 left-0"
          style={newTitleOpacityStyle}
        >
          <CardTitle
            title={"Hourly Forecast"}
            icon={<CalendarDaysIcon size={iconSize} color={"white"} />}
            className={"pb-2"}
          />
        </Animated.View>
      </>
    ),
    [oldTitleOpacityStyle, newTitleOpacityStyle, iconSize]
  );

  return (
    <VisualHeightChange
      onLayout={hourlyOnLayout}
      layoutHeight={hourlyLayoutHeight}
      heightAnimation={hourlyHeight}
      removalAnimation={hourlyRemoval}
    >
      <HourlyForecastCard
        cityName={cityName}
        showModal={modalCallbacks.conditions}
        style={hourlyCollapse}
        title={memoizedHourlyTitle}
      />
    </VisualHeightChange>
  );
};

export default Hourly;
