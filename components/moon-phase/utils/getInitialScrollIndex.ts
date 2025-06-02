import { useMemo } from "react";
import { getDaysSincePrevMonth } from "./getDaysSincePrevMonth";
import { TICKS_PER_DAY } from "./constants";

export const getInitialScrollIndex = () => {
  const daysSincePrevMonth = useMemo(() => getDaysSincePrevMonth(), []);
  const initialScrollPosition = TICKS_PER_DAY * daysSincePrevMonth * 10;
  const initialScrollIndex = initialScrollPosition / 10;
  return { daysSincePrevMonth, initialScrollPosition, initialScrollIndex };
};
