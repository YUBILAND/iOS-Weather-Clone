import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { getTicksAmount } from "./getTicksAmount";
import { SharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { WeatherData } from "@/constants/constants";

export const getScrolledDate = (
  data: WeatherData,
  offsetX: number,
  tickPosition: SharedValue<number>
) => {
  const { totalTicks } = getTicksAmount();

  let startingDate: Date = new Date();
  const currentMonth = new Date().getMonth();
  startingDate = new Date(2025, currentMonth - 1, 1);

  //  add 1 to bounds so that haptic works on both directions
  const withinBounds =
    Math.floor(offsetX / 120) >= -1 &&
    Math.floor(offsetX / 120) <= (totalTicks - 1) / 12 + 1;
  const scrolledPastWhiteLine =
    Math.floor(offsetX / 120) !== Math.floor(tickPosition.value / 120) &&
    withinBounds;
  if (scrolledPastWhiteLine) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  tickPosition.value = offsetX;

  const scrollPosInDays = Math.floor(Math.floor(offsetX) / 120);

  const leftScrollBound = Math.min(scrollPosInDays, (totalTicks - 1) / 12);

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
