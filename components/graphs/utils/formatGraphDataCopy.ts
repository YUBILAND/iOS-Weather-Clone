import { WeatherData } from "@/constants/constants";
import { getCurrentHour } from "@/hooks/hooks";
import { ForecastData } from "./useForecastData";

export const formatGraphDataCopy = (
  data: WeatherData,
  todaysForecast: ForecastData,
  currentPositionIndex: number = getCurrentHour(data.location?.tz_id)
) => {
  // Formats Data for Victory Native Graph

  const graphData = todaysForecast.map((hour, index) => ({
    hour: index,
    currentLineTop: index === currentPositionIndex ? 10000 : undefined,
    currentLineBottom: index === currentPositionIndex ? 10000 : undefined,
    currentPosition: index === currentPositionIndex ? hour.mainLine : undefined,
    mainLine: hour.mainLine,
    secondLine: hour?.secondLine,
    thirdLine: hour?.thirdLine,
    // secondLine: hour?.secondLine ?? undefined,
    // thirdLine: hour?.thirdLine ?? undefined,
  }));

  return graphData;
};
