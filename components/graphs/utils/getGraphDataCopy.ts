import { HourObject, WeatherData } from "@/constants/constants";
import { formatGraphData } from "./formatGraphData";
import { getTodaysForecast } from "./getTodaysForecast";
import { formatGraphDataCopy } from "./formatGraphDataCopy";

// Will accept { value: number} for graph data instead of apiObjectKey

export const getGraphDataCopy = (
  data: WeatherData,
  todaysForecast: {
    mainLine: number;
    secondLine?: number;
    thirdLine?: number;
  }[]
) => {
  const graphData = formatGraphDataCopy(data, todaysForecast);

  return graphData;
};
