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
  const mostUpToDateMinute = getMinutesFromEpoch(epochArr);

  const currentHour = new Date().getHours();
  const lastIndex = epochArr ? epochArr.length - 1 : 0;
  const startingMinute = mostUpToDateMinute ?? 0;

  const mins = getSliderMins(startingMinute, index);
  const hour = getSliderHr(startingMinute, currentHour, index);

  const getSliderStepLabel = () => {
    const timeLabel = mins === 0 ? hour : ":" + mins;
    const label = index === lastIndex ? "Now" : timeLabel;
    return label;
  };

  const label = getSliderStepLabel();

  const isLastIndex = index === lastIndex;
  return (
    <View style={{ paddingTop: 24 }}>
      <DefaultText
        style={{
          color: "black",
          fontSize: 12,
          fontWeight: isLastIndex || mins === 0 ? 700 : 500,
        }}
      >
        {label}
      </DefaultText>
    </View>
  );
};

export default React.memo(CustomStepMarker);
