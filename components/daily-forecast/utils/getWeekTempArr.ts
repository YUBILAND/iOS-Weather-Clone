import { WeatherData } from "@/constants/constants";

export const getWeekTempArr = (data: WeatherData) => {
  let weekTempArr: number[] = [];

  for (let i = 0; i < 3; i++) {
    weekTempArr = [
      ...weekTempArr,
      ...data.forecast.forecastday[i].hour.map((hour) =>
        parseFloat(hour.temp_c)
      ),
    ];
  }

  return weekTempArr;
};
