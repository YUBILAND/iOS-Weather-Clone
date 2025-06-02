import { getShortWeekday } from "@/components/daily-forecast/utils/getShortWeekday";
import { weekday } from "@/constants/constants";
import { getDaysOfMonth } from "@/hooks/hooks";
import { getTicksAmount } from "./getTicksAmount";

export const getTickArr = (whiteTicks: number, totalTicks: number) => {
  const startingDate = new Date(2025, new Date().getMonth() - 1, 1);
  const startingWeekday = startingDate.toLocaleString("en-US", {
    weekday: "long",
  });

  const startingWeekdayAsIndex = weekday.indexOf(startingWeekday);

  let weekdayArr: string[] = [];
  for (let i = 0; i < whiteTicks; i++) {
    weekdayArr.push(getShortWeekday(weekday[(i + startingWeekdayAsIndex) % 7]));
  }

  return Array(totalTicks)
    .fill(0)
    .map((_, idx) => ({
      id: idx,
      weekday: weekdayArr[Math.floor(idx % 12)],
    }));
};
