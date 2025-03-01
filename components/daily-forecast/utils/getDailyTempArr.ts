import { WeatherData } from "@/constants/constants";

export const getDailyTempArr = (data: WeatherData, index: number) => {
  return data.forecast.forecastday[index].hour.map((hour) =>
    parseFloat(hour.temp_c)
  );
};
