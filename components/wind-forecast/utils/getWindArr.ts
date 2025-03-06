import { WeatherData } from "@/constants/constants";

export const getWindArr = (data: WeatherData, index: number) => {
  return data.forecast.forecastday[index].hour.map((hour) => hour.wind_mph);
};
