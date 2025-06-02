import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import { iconSize } from "./utils/constants";
import RainHourCard from "../rain-hour/RainHourCard";
import DefaultText from "../atoms/DefaultText";
import CardTitle from "../atoms/CardTitle";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { FontAwesome } from "@expo/vector-icons";
// import RainHourCard from "../air-pressure/RainHourCard";

interface RainHourProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const RainHour = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: RainHourProps) => {
  const {
    collapseStyle: rainHourCollapse,
    heightStyle: rainHourHeight,
    removalOpacityStyle: rainHourRemoval,
    layoutHeight: rainHourLayoutHeight,
    onLayout: rainHourOnLayout,
    oldTitleOpacityStyle,
    newTitleOpacityStyle,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(rainHourLayoutHeight ?? 0);

  const memoizedRainTitle = useMemo(
    () => (
      <>
        <Animated.View style={oldTitleOpacityStyle}>
          <DefaultText
            style={{ fontSize: 24, lineHeight: 24, fontWeight: 700 }}
          >
            Rain Forecasted
          </DefaultText>
        </Animated.View>
        <Animated.View
          className="absolute top-0 left-0"
          style={newTitleOpacityStyle}
        >
          <CardTitle
            title={"Next-Hour Precipitation"}
            icon={
              <FontAwesome name="umbrella" size={iconSize} color={"white"} />
            }
            className={"pb-2"}
          />
        </Animated.View>
      </>
    ),
    [oldTitleOpacityStyle, newTitleOpacityStyle, iconSize]
  );

  return (
    <VisualHeightChange
      onLayout={rainHourOnLayout}
      layoutHeight={rainHourLayoutHeight}
      heightAnimation={rainHourHeight}
      removalAnimation={rainHourRemoval}
    >
      <RainHourCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.rainHour}
        collapseFromTopStyle={rainHourCollapse}
        title={memoizedRainTitle}
      />
    </VisualHeightChange>
  );
};

export default RainHour;
