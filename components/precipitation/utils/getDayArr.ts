import { convertWindUnits } from "@/components/wind-forecast/utils/convertWindUnits";
import { GraphKeyType, WeatherData } from "@/constants/constants";
import { getDistance, getTemperature } from "@/hooks/useDisplayUnits";
import { useOtherUnits } from "@/hooks/useOtherUnits";

export const getDayArr = (
  data: WeatherData,
  id: number,
  objectKey: keyof GraphKeyType
) => {
  const windUnits = useOtherUnits()["wind"];

  return ["wind_mph", "gust_mph"].includes(objectKey)
    ? data.forecast.forecastday[id].hour.map((hour) =>
        convertWindUnits(hour[objectKey], windUnits)
      )
    : objectKey === "temp_c" || objectKey === "windchill_c"
    ? data.forecast.forecastday[id].hour.map((hour) =>
        getTemperature(hour[objectKey])
      )
    : objectKey === "vis_miles"
    ? data.forecast.forecastday[id].hour.map((hour) =>
        getDistance(hour[objectKey])
      )
    : data.forecast.forecastday[id].hour.map((hour) => hour[objectKey]);
};
