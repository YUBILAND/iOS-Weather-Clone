import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { getMinMaxArr } from "@/components/utils/getMinMaxArr";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import { getTemperature } from "@/hooks/useDisplayUnits";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { useWeatherData } from "@/hooks/useWeatherData";

export const getLocationCardData = (cityName: string) => {
  const data = useWeatherData();
  const is12Hr = useIs12Hr();

  const currentTemp = Math.round(getTemperature(data[cityName].current.temp_c));
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

  const { arrMax: currentHigh, arrMin: currentLow } = getMinMaxArr(
    getDayArr(data[cityName], 0, "temp_c")
  );

  return {
    currentTemp,
    cityTime,
    currentWeatherCondition,
    currentHigh,
    currentLow,
  };
};
