import { WeatherData } from "@/constants/constants";

export const getWeekMaxWind = (data: WeatherData) => {
  const weekMaxWind = Math.max(
    ...data.forecast?.forecastday.map((day) => day.day.maxwind_mph)
  );

  return weekMaxWind;
};
