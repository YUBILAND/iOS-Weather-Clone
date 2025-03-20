import { GraphKeyType, WeatherData } from "@/constants/constants";

export const getDayArr = (
  data: WeatherData,
  id: number,
  objectKey: keyof GraphKeyType
) => {
  return data.forecast.forecastday[id].hour.map((hour) => hour[objectKey]);
};
