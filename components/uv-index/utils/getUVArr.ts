import { WeatherData } from "@/constants/constants";

export const getUVArr = (data: WeatherData, index: number) => {
  return data.forecast.forecastday[index].hour.map((hour) => hour.uv);
};
