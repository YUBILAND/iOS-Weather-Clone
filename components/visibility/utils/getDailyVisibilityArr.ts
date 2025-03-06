import { HourObject, WeatherData } from "@/constants/constants";

export const getDailyVisibilityArr = (
  data: WeatherData,
  apiObjectString: keyof HourObject,
  index: number
) => {
  return data.forecast.forecastday[index].hour.map(
    (hour) => hour[apiObjectString] as number
  );
};
