import { regularTimeOnXAxis } from "@/components/sun-phase/utils/getRegularTimeOnXAxis";
import { HourObject, WeatherData } from "@/constants/constants";
import { getCurrentTime, militaryHour } from "@/hooks/hooks";

export const getGraphData = (
  data: WeatherData,
  maxRange: number,
  minRange: number,
  currentIndex: number,
  yAxis: string,
  apiObjectKey: keyof HourObject
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
    },
  ];

  const currentTime = getCurrentTime(data.location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const graphData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    [yAxis]: parseFloat(hour[apiObjectKey].toString()),
    currentLineTop: index === currentHour ? maxRange + 2 : undefined,
    currentLineBottom: index === currentHour ? minRange - 2 : undefined,
    currentPosition:
      index === xPosition
        ? Math.round(parseFloat(hour[apiObjectKey].toString()))
        : undefined,
  }));
  return graphData;
};
