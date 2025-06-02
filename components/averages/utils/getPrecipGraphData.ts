import { WeatherData } from "@/constants/constants";
import { averagePrecipExample, currentPrecipExample } from "./constants";
import { formatGraphDataCopy } from "@/components/graphs/utils/formatGraphDataCopy";

export const getPrecipGraphData = (data: WeatherData) => {
  const totalPrecipDays = 40;
  const indexToShowDot = currentPrecipExample.length - 1;

  const precipDayArr = Array(totalPrecipDays)
    .fill(0)
    .map((_, index) => {
      return {
        // mainLine: hour.high,
        mainLine: currentPrecipExample[index]?.average ?? undefined,
        secondLine: averagePrecipExample[index]?.average ?? undefined,
      };
    });
  const precipGraphData = formatGraphDataCopy(
    data,
    precipDayArr,
    indexToShowDot
  );
  return precipGraphData;
};
