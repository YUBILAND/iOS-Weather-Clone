import { WeatherData } from "@/constants/constants";
import { MoonPhase } from "./constants";

export const getCurrentMoonPhase = (
  data: WeatherData,
  userScrolledIndex: number,
  initialScrollIndex: number
) => {
  const currentMoonIllumination =
    data.forecast?.forecastday[0].astro.moon_illumination;

  const startingMoonIllumination =
    (parseInt(currentMoonIllumination) / 100) * 15;

  const currentMoonPhase: MoonPhase =
    Math.abs(
      Math.floor(
        (userScrolledIndex - initialScrollIndex + startingMoonIllumination) / 15
      ) % 2
    ) === 0
      ? "waxing"
      : "waning";
  return currentMoonPhase;
};
