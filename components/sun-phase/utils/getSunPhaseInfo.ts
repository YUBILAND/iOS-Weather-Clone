import { WeatherData } from "@/constants/constants";
import { getChordLength, stringToTime } from "@/hooks/hooks";

export const getSunPhaseInfo = (data: WeatherData, americanTime: boolean) => {
  const sunriseTime = data.forecast?.forecastday[0].astro.sunrise;
  const sunsetTime = data.forecast?.forecastday[0].astro.sunset;

  const sunlightTime = getChordLength(sunriseTime, sunsetTime, true);
  const sunlightHours = sunlightTime.toString().split(".")[0];
  const sunlightMinutes = parseInt(sunlightTime.toString().split(".")[1]);

  return {
    Dawn: stringToTime(
      americanTime,
      data.forecast?.forecastday[0].astro.sunrise,
      false,
      -28
    ),
    "Today's Sunrise": stringToTime(
      americanTime,
      data.forecast?.forecastday[0].astro.sunrise
    ),

    "Today's Sunset": stringToTime(
      americanTime,
      data.forecast?.forecastday[0].astro.sunset
    ),
    Dusk: stringToTime(
      americanTime,
      data.forecast?.forecastday[0].astro.sunset,
      false,
      28
    ),
    Sunlight:
      sunlightHours +
      " hrs " +
      (sunlightMinutes ? sunlightMinutes + " mins" : ""),
  };
};
