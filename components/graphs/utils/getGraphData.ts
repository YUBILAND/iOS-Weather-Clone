import { HourObject, WeatherData } from "@/constants/constants";
import { formatGraphData } from "./formatGraphData";
import { getTodaysForecast } from "./getTodaysForecast";

export const getGraphData = (
  data: WeatherData,
  maxRange: number,
  minRange: number,
  currentIndex: number,
  yAxis: string[],
  apiObjectKey: (keyof HourObject)[]
) => {
  const todaysForecast = getTodaysForecast(data, apiObjectKey, currentIndex);

  const graphData = formatGraphData(
    data,
    todaysForecast,
    yAxis,
    apiObjectKey,
    maxRange,
    minRange
  );

  return graphData;
};
