import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Vibration,
} from "react-native";
import { getTicksAmount } from "./getTicksAmount";
import { SharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { WeatherData } from "@/constants/constants";
import { TICKS_PER_DAY } from "./constants";

export const getScrolledDate = (
  data: WeatherData,
  offsetX: number,
  tickPosition: SharedValue<number>,
  setUserScrolledIndex: (offset: number) => void
) => {
  const { totalTicks } = getTicksAmount();

  let startingDate: Date = new Date();
  const currentMonth = new Date().getMonth();
  startingDate = new Date(2025, currentMonth - 1, 1);

  const distance = 120;

  const scrollIndex = Math.floor(offsetX / distance);

  const isScrollPastBoundary = () => {
    //  add 1 to bounds so that haptic works on both directions
    const withinBounds =
      scrollIndex >= -1 && scrollIndex <= (totalTicks - 1) / TICKS_PER_DAY + 1;
    const scrolledPastWhiteLine =
      scrollIndex !== Math.floor(tickPosition.value / distance) && withinBounds;
    return scrolledPastWhiteLine;
  };

  const scrolledPastBoundary = isScrollPastBoundary();
  if (scrolledPastBoundary) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserScrolledIndex(scrollIndex);
  }

  tickPosition.value = offsetX;

  const getScrollPosToDateString = () => {
    const scrollPosInDays = Math.floor(Math.floor(offsetX) / distance);
    const leftScrollBound = Math.min(
      scrollPosInDays,
      (totalTicks - 1) / TICKS_PER_DAY
    );
    const leftAndRightScrollBound = Math.max(leftScrollBound, 0);

    // Get previous month to add days
    const dateJustForMonth = new Date(startingDate);

    const scrollPosToDateObject = new Date(
      dateJustForMonth.setDate(startingDate.getDate() + leftAndRightScrollBound)
    );

    const scrollPosToDateString = scrollPosToDateObject.toLocaleDateString(
      "en-US",
      {
        timeZone: data.location.tz_id,
        month: "numeric",
        day: "numeric",
        weekday: "short",
      }
    );

    return scrollPosToDateString;
  };

  const scrollPosToDateString = getScrollPosToDateString();

  return scrollPosToDateString;
};
