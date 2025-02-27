import { WeatherData } from "@/constants/constants";
import { getCurrentTime, stringToTime } from "@/hooks/hooks";
import { regularTimeOnXAxis } from "./getRegularTimeOnXAxis";

export const getNextPhaseTime = (
  data: WeatherData,
  currentTime: string,
  americanTime: boolean
) => {
  const currentSunriseTime = data.forecast.forecastday[0].astro.sunrise.replace(
    /^0/,
    ""
  );

  const currentSunsetTime = data.forecast.forecastday[0].astro.sunset.replace(
    /^0/,
    ""
  );

  const nextSunriseTime = data.forecast.forecastday[1].astro.sunrise.replace(
    /^0/,
    ""
  );

  const normalizedCurrentTime = regularTimeOnXAxis(currentTime);
  const normalizedSunrise = regularTimeOnXAxis(currentSunriseTime);
  const normalizedSunset = regularTimeOnXAxis(currentSunsetTime);

  let nextPhaseTime = "";

  if (normalizedCurrentTime < normalizedSunrise) {
    // show sunrise Time
    nextPhaseTime = currentSunriseTime;
  } else if (
    normalizedCurrentTime >= normalizedSunrise &&
    normalizedCurrentTime < normalizedSunset
  ) {
    // show sunrise time
    nextPhaseTime = currentSunsetTime;
  } else {
    //show tomorrows sunrise time
    nextPhaseTime = nextSunriseTime;
  }

  // conver to 12hr or 24hr
  nextPhaseTime = stringToTime(americanTime, nextPhaseTime);

  return nextPhaseTime;
};
