import { GraphKeyType, WeatherData } from "@/constants/constants";
import { getPressure, getTemperature } from "@/hooks/useDisplayUnits";

export const getWeekArr = (
  data: WeatherData,
  objectKey: keyof GraphKeyType
) => {
  let weekArr: number[] = [];

  for (let i = 0; i < 3; i++) {
    weekArr = [
      ...weekArr,
      ...data.forecast.forecastday[i].hour.map((hour) =>
        ["temp_c", "windchill_c"].includes(objectKey)
          ? getTemperature(hour[objectKey])
          : ["pressure_in"].includes(objectKey)
          ? getPressure(hour[objectKey])
          : hour[objectKey]
      ),
    ];
  }

  return weekArr;
};
