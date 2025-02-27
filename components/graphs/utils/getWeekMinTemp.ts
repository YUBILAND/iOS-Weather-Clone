import { WeatherData } from "@/constants/constants";

export const getWeekMinTemp = (data: WeatherData) => {
  const weekMinTemp = Math.min(
    ...data.forecast?.forecastday.map((day) => parseFloat(day.day.mintemp_c))
  );
  return weekMinTemp;
};
