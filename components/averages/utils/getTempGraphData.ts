import { formatGraphDataCopy } from "@/components/graphs/utils/formatGraphDataCopy";
import { useForecastData } from "@/components/graphs/utils/useForecastData";
import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { WeatherData } from "@/constants/constants";
import { getTemperature } from "@/hooks/useDisplayUnits";
import { averageRangeExample } from "./constants";

export const getTempGraphData = (data: WeatherData) => {
  const tempDayArr = getDayArr(data, 0, "temp_c");
  const tempForecastWithoutMidnight = averageRangeExample.map((hour, index) => {
    return {
      mainLine: tempDayArr[index],
      secondLine: getTemperature(hour.high),
      thirdLine: getTemperature(hour.low),
    };
  });
  const tempAvgForecast = useForecastData(tempForecastWithoutMidnight);
  const tempGraphData = formatGraphDataCopy(data, tempAvgForecast);

  return tempGraphData;
};
