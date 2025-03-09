import { regularTimeOnXAxis } from "@/components/sun-phase/utils/getRegularTimeOnXAxis";
import { HourObject, WeatherData } from "@/constants/constants";
import { getCurrentTime, militaryHour } from "@/hooks/hooks";

export const getGraphData = (
  data: WeatherData,
  maxRange: number,
  minRange: number,
  currentIndex: number,
  yAxis: string,
  apiObjectKey: keyof HourObject,
  apiObjectKey2?: keyof HourObject
) => {
  const currentHour = militaryHour(
    new Date().toLocaleTimeString("en-US", { timeZone: data.location?.tz_id })
  );

  // Add midnight value
  const todaysForecast = data.forecast?.forecastday[currentIndex]?.hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      [apiObjectKey as string]:
        todaysForecast[todaysForecast.length - 1][apiObjectKey],
      ...(apiObjectKey2
        ? {
            [apiObjectKey2 as string]:
              todaysForecast[todaysForecast.length - 1][apiObjectKey2],
          }
        : {}),
    },
  ];

  const currentTime = getCurrentTime(data.location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const graphData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    [yAxis]:
      apiObjectKey && hour[apiObjectKey] !== undefined
        ? parseFloat(hour[apiObjectKey].toString())
        : 0,
    currentLineTop: index === currentHour ? maxRange + 100 : undefined,
    currentLineBottom: index === currentHour ? minRange - 100 : undefined,
    currentPosition:
      index === xPosition
        ? Math.round(parseFloat(hour[apiObjectKey].toString()))
        : undefined,
    secondLine:
      apiObjectKey2 && hour[apiObjectKey2] !== undefined
        ? Math.round(parseFloat(hour[apiObjectKey2].toString()))
        : 0,
  }));

  return graphData;
};
