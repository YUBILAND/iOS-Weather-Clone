import { WeatherData } from "@/constants/constants";

export const getDailyWindChillArr = (data: WeatherData, index: number) => {
  return data.forecast.forecastday[index].hour.map((hour) => hour.windchill_c);
};
