import { regularTimeOnXAxis } from "@/components/sun-phase/utils/getRegularTimeOnXAxis";
import { HourObject, WeatherData } from "@/constants/constants";
import { getCurrentHour, getCurrentTime } from "@/hooks/hooks";

export const formatGraphData = (
  data: WeatherData,
  todaysForecast: any[],
  yAxis: string[],
  objectKey: (keyof HourObject)[],
  maxRange: number,
  minRange: number
) => {
  const currentHour = getCurrentHour(data.location?.tz_id);
  const currentTime = getCurrentTime(data.location?.tz_id);
  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const graphData = todaysForecast.map((hour, index) => ({
    hour: index,
    [yAxis[0]]:
      objectKey && hour[objectKey[0]] !== undefined
        ? parseFloat(hour[objectKey[0]].toString())
        : 0,
    currentLineTop: index === currentHour ? maxRange + 1000 : undefined,
    currentLineBottom: index === currentHour ? minRange - 1000 : undefined,
    currentPosition:
      index === xPosition
        ? parseFloat(hour[objectKey[0] ?? objectKey].toString())
        : undefined,
    [yAxis[1] ? yAxis[1] : "secondLine"]:
      objectKey[1] && hour[objectKey[1]] !== undefined
        ? Math.round(parseFloat(hour[objectKey[1]].toString()))
        : 0,
  }));

  return graphData;
};
