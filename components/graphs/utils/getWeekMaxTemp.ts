import { WeatherData } from "@/constants/constants";

export const getWeekMaxTemp = (data: WeatherData) => {
  const weekMaxTemp = Math.max(
    ...data.forecast?.forecastday.map((day) => parseFloat(day.day.maxtemp_c))
  );

  return weekMaxTemp;
};
