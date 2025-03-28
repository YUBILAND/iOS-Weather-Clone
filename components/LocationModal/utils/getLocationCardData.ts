import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import { useAmericanTime } from "@/hooks/useAmericanTime";
import { useWeatherData } from "@/hooks/useWeatherData";

export const getLocationCardData = (city: string) => {
  const data = useWeatherData();
  const americanTime = useAmericanTime();
  const currentTemp = parseFloat(data[city].current.temp_c);
  const currentTimeZone = data[city].location.tz_id;
  const cityTime = removeZeroFromTimeString(
    new Date().toLocaleTimeString("en-US", {
      timeZone: currentTimeZone,
      hour12: americanTime,
      hour: "numeric",
      minute: "2-digit",
    })
  );
  const currentWeatherCondition = data[city].current.condition.text;
  const dailyTempArr = getDayArr(data[city], 0, "temp_c");
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
