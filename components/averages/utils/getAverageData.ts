import { WeatherData } from "@/constants/constants";
import { getCurrentHour } from "@/hooks/hooks";
import { averageRangeExample } from "./constants";
import { getTemperature } from "@/hooks/useDisplayUnits";
import { getDayArr } from "@/components/precipitation/utils/getDayArr";
import { getArrAverage } from "@/components/helper-functions/helperFunctions";

export const getAverageData = (data: WeatherData) => {
  const currentTimeZone = data.location.tz_id;
  const currentTimeIndex = getCurrentHour(currentTimeZone);
  const averageHigh = Math.round(
    getArrAverage(averageRangeExample.map((item) => getTemperature(item.high)))
  );
  const todaysTempArr = getDayArr(data, 0, "temp_c");
  const currentTemperature = todaysTempArr[currentTimeIndex];
  const tempFromAverage = Math.abs(
    Math.round(averageHigh - currentTemperature)
  );

  return { currentTemperature, averageHigh, tempFromAverage };
};
