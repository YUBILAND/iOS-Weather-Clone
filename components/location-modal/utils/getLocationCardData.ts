import { getDailyTempArr } from "@/components/daily-forecast/utils/getDailyTempArr";
import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { getTemperature } from "@/hooks/getTemperature";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useWeatherData } from "@/hooks/useWeatherData";

export const getLocationCardData = (cityName: string) => {
  const data = useWeatherData();
  const is12Hr = useIs12Hr();
  const tempUnit = useTemperatureUnit();

  const currentTemp = Math.round(
    getTemperature(data[cityName].current.temp_c, tempUnit)
  );
  const currentTimeZone = data[cityName].location.tz_id;
  const cityTime = removeZeroFromTimeString(
    new Date().toLocaleTimeString("en-US", {
      timeZone: currentTimeZone,
      hour12: is12Hr,
      hour: "numeric",
      minute: "2-digit",
    })
  );
  const currentWeatherCondition = data[cityName].current.condition.text;
  const dailyTempArr = getDailyTempArr(data[cityName], 0, tempUnit);
  const currentHigh = Math.max(...dailyTempArr);
  const currentLow = Math.min(...dailyTempArr);

  return {
    currentTemp,
    cityTime,
    currentWeatherCondition,
    currentHigh,
    currentLow,
  };
};
