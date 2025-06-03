import DefaultText from "@/components/atoms/DefaultText";
import { MarkerProps } from "@react-native-community/slider";
import { View } from "react-native";
import { getMinutesFromEpoch } from "./getMinutesFromEpoch";
import React from "react";
import { getSliderHr, getSliderMins } from "./constants";

const CustomStepMarker = ({
  currentValue,
  stepMarked,
  index,
  epochArr,
}: MarkerProps & { epochArr: number[] | null }) => {
  // Not from weather screen timezone but from user's location

  const { isLastIndex, minsIsZero, label } = getStepMarkerLabel(
    epochArr,
    index
  );

  return (
    <View style={{ paddingTop: 24 }}>
      <DefaultText
        style={{
          color: "black",
          fontSize: 12,
          fontWeight: isLastIndex || minsIsZero ? 700 : 500,
        }}
      >
        {label}
      </DefaultText>
    </View>
  );
};

export const getStepMarkerLabel = (
  epochArr: number[] | null,
  index: number
) => {
  const mostUpToDateMinute = getMinutesFromEpoch(epochArr);

  const currentHour = new Date().getHours();
  const lastIndex = epochArr ? epochArr.length - 1 : 0;
  const startingMinute = mostUpToDateMinute ?? 0;

  const mins = getSliderMins(startingMinute, index);
  const hour = getSliderHr(startingMinute, currentHour, index);

  const minsIsZero = mins === 0;

  const getSliderStepLabel = () => {
    const timeLabel = minsIsZero ? hour : ":" + mins;
    // const timeLabel = minsIsZero ? hour : "0";

    const label = index === lastIndex ? "Now" : timeLabel;
    return label;
  };

  const label = getSliderStepLabel();
  const isLastIndex = index === lastIndex;

  return { isLastIndex, minsIsZero, label };
};

export default React.memo(CustomStepMarker);
