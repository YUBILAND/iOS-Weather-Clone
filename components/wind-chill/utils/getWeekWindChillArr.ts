import { WeatherData } from "@/constants/constants";

export const getWeekWindChillArr = (data: WeatherData) => {
  let weekWindChillArr: number[] = [];

  for (let i = 0; i < 3; i++) {
    weekWindChillArr = [
      ...weekWindChillArr,
      ...data.forecast.forecastday[i].hour.map((hour) => hour.windchill_c),
    ];
  }
  return weekWindChillArr;
};
