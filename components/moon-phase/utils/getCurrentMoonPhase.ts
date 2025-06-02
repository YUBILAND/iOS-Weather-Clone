import { WeatherData } from "@/constants/constants";
import { MoonPhase } from "./constants";
import { getDaysSincePrevFullMoon } from "./getDaysSincePrevFullMoon";
import { useMemo } from "react";

export const getCurrentMoonPhase = (
  data: WeatherData,
  userScrolledIndex: number,
  initialScrollIndex: number
) => {
  const daysSincePrevFullMoon = useMemo(() => getDaysSincePrevFullMoon(), []);

  const distanceUserScrolledFromInitial =
    userScrolledIndex - initialScrollIndex;

  const currentMoonPhase: MoonPhase =
    Math.abs(
      Math.floor(
        // (userScrolledIndex - initialScrollIndex + startingMoonIllumination) / 15
        (daysSincePrevFullMoon + distanceUserScrolledFromInitial) / 15
      ) % 2
    ) === 0
      ? "waning" // From Full Moon Starting Point, the waning phase will always be first since it is transitioning from full moon to new moon
      : "waxing";

  return currentMoonPhase;
};
