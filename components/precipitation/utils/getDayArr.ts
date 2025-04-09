import { TempUnit } from "@/components/location-modal/SettingsDropdown";
import { GraphKeyType, WeatherData } from "@/constants/constants";
import { getTemperature } from "@/hooks/getTemperature";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";

export const getDayArr = (
  data: WeatherData,
  id: number,
  objectKey: keyof GraphKeyType
) => {
  return data.forecast.forecastday[id].hour.map((hour) => hour[objectKey]);
};
