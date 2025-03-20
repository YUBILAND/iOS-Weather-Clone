import { MoonPhase } from "./constants";
import { getDaysSincePrevFullMoon } from "./getDaysSincePrevFullMoon";

export const getInitialMoonPhase = () => {
  const daysSincePrevFullMoon = getDaysSincePrevFullMoon();

  const initialMoonPhase: MoonPhase =
    Math.abs(
      Math.floor(
        // (userScrolledIndex - initialScrollIndex + startingMoonIllumination) / 15
        daysSincePrevFullMoon / 15
      ) % 2
    ) === 0
      ? "waning" // From Full Moon Starting Point, the waning phase will always be first since it is transitioning from full moon to new moon
      : "waxing";

  return initialMoonPhase;
};
