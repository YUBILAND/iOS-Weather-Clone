import { HourObject, WeatherData } from "@/constants/constants";

export const getWeekVisibilityArr = (
  data: WeatherData,
  apiObjectString: keyof HourObject
) => {
  let weekWindChillArr: number[] = [];

  for (let i = 0; i < 3; i++) {
    weekWindChillArr = [
      ...weekWindChillArr,
      ...data.forecast.forecastday[i].hour.map(
        (hour) => hour[apiObjectString] as number
      ),
    ];
  }
  return weekWindChillArr;
};
