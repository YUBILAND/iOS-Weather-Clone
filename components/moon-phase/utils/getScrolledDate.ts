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

  //  add 1 to bounds so that haptic works on both directions
  const withinBounds =
    Math.floor(offsetX / distance) >= -1 &&
    Math.floor(offsetX / distance) <= (totalTicks - 1) / TICKS_PER_DAY + 1;
  const scrolledPastWhiteLine =
    Math.floor(offsetX / distance) !==
      Math.floor(tickPosition.value / distance) && withinBounds;
  if (scrolledPastWhiteLine) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserScrolledIndex(Math.floor(offsetX / distance));
  }

  tickPosition.value = offsetX;

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
