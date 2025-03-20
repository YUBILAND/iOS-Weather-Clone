import { HourObject, WeatherData } from "@/constants/constants";

export const getArr = (data: WeatherData, key: keyof HourObject) => {
  let weekArr: number[] = [];

  for (let i = 0; i < 3; i++) {
    weekArr = [
      ...weekArr,
      ...(data.forecast.forecastday[i].hour.map(
        (hour) => hour[key]
      ) as number[]),
    ];
  }
  return weekArr;
};
