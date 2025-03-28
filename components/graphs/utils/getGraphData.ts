import { regularTimeOnXAxis } from "@/components/sun-phase/utils/getRegularTimeOnXAxis";
import { GraphKeyType, HourObject, WeatherData } from "@/constants/constants";
import { getCurrentTime, militaryHour } from "@/hooks/hooks";

export const getGraphData = (
  data: WeatherData,
  maxRange: number,
  minRange: number,
  currentIndex: number,
  yAxis: string[],
  apiObjectKey: (keyof HourObject)[],
  apiObjectKey2?: keyof HourObject
) => {
  const currentHour = militaryHour(
    new Date().toLocaleTimeString("en-US", { timeZone: data.location?.tz_id })
  );

  // Fill in missing 24:00 or 0:00 time. Just a copy of 23:00 data
  const todaysForecast = data.forecast?.forecastday[currentIndex]?.hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      [apiObjectKey[0] as string]:
        todaysForecast[todaysForecast.length - 1][apiObjectKey[0]],
      ...(apiObjectKey[1]
        ? {
            [apiObjectKey[1] as string]:
              todaysForecast[todaysForecast.length - 1][apiObjectKey[1]],
          }
        : {}),
    },
  ];

  const currentTime = getCurrentTime(data.location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const graphData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    [yAxis[0]]:
      apiObjectKey && hour[apiObjectKey[0]] !== undefined
        ? parseFloat(hour[apiObjectKey[0]].toString())
        : 0,
    currentLineTop: index === currentHour ? maxRange + 100 : undefined,
    currentLineBottom: index === currentHour ? minRange - 100 : undefined,
    currentPosition:
      index === xPosition
        ? parseFloat(hour[apiObjectKey[0] ?? apiObjectKey].toString())
        : undefined,
    [yAxis[1] ? yAxis[1] : "secondLine"]:
      apiObjectKey[1] && hour[apiObjectKey[1]] !== undefined
        ? Math.round(parseFloat(hour[apiObjectKey[1]].toString()))
        : 0,
  }));

  return graphData;
};
