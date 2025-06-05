import { colors } from "@/assets/colors/colors";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import React from "react";
import { Text } from "react-native";
import {
  getSliderHr,
  getSliderMins,
  hour12ForecastOptions,
  hour24ForecastOptions,
  weekdayOption,
} from "./utils/constants";
import { getMinutesFromEpoch } from "./utils/getMinutesFromEpoch";

interface SliderDateProps {
  showYesterday: boolean;
  epochArr: number[] | null;
  index: number;
}

// I only have previous 2 hour so if current date is 9th then the slider will only show 9th or 2hrs back being 8th
const SliderDate = ({ showYesterday, epochArr, index }: SliderDateProps) => {
  const is12Hr = useIs12Hr();

  const mostUpToDateMinute = getMinutesFromEpoch(epochArr);

  const options = is12Hr ? hour12ForecastOptions : hour24ForecastOptions;

  const currentHour = new Date().getHours();
  const lastIndex = epochArr ? epochArr.length - 1 : 0;
  const startingMinute = mostUpToDateMinute ?? 0;

  const mins = getSliderMins(startingMinute, index).toString().padStart(2, "0");
  const hour = getSliderHr(startingMinute, currentHour, index, is12Hr);

  const formattedSliderDate = () => {
    const hour12 = hour === 0 || hour === 12 ? 12 : hour % 12;
    const hour24 = hour + ":" + mins;
    const meridian = hour < 12 ? "AM" : "PM";
    const hourAfterOption = is12Hr ? hour12 + meridian : hour24;
    return hourAfterOption;
  };

  const sliderDate = formattedSliderDate();

  const isLastIndex = index === lastIndex;

  const weekday = new Date().toLocaleDateString("en-US", weekdayOption);

  return (
    <Text
      style={{
        color: colors.mediumGray,
        fontSize: 16,
        lineHeight: 16,
      }}
    >
      {isLastIndex
        ? new Date().toLocaleDateString("en-US", options)
        : showYesterday
        ? getYesterdaysWeekday() + " " + sliderDate
        : weekday + " " + sliderDate}
    </Text>
  );
};

const getYesterdaysWeekday = () => {
  let day = new Date();
  let yesterday = new Date(day);
  yesterday.setDate(day.getDate() - 1);

  return yesterday.toLocaleDateString("en-US", weekdayOption);
};

export default SliderDate;
