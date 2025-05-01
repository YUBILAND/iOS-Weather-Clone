import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { getMinMaxArr } from "@/components/utils/getMinMaxArr";
import { GraphKeyType, WeatherData } from "@/constants/constants";
import { getTemperature } from "@/hooks/useDisplayUnits";

export type TemperatureBarGroup = {
  text: string;
  low: number;
  high: number;
  currentTemp?: number;
};

export const getDailyComparisonArr = (
  data: WeatherData,
  objectKey: keyof GraphKeyType
) => {
  const { arrMax: todaysHigh, arrMin: todaysLow } = getMinMaxArr(
    getDayArr(data, 0, objectKey)
  );

  const { arrMax: tomorrowsHigh, arrMin: tomorrowsLow } = getMinMaxArr(
    getDayArr(data, 1, objectKey)
  );

  //   @ts-ignore mismatch between current and HourObject, they have common items but not entirely the same
  const currentTemps = getTemperature(data.current[objectKey]);

  const dailyComparisonArr: TemperatureBarGroup[] = [
    {
      text: "Today",
      low: todaysLow,
      high: todaysHigh,
      currentTemp: currentTemps,
    },
    { text: "Tomorrow", low: tomorrowsLow, high: tomorrowsHigh },
  ];

  return dailyComparisonArr;
};
