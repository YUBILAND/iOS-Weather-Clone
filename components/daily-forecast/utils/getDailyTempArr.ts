import { TempUnit } from "@/components/location-modal/SettingsDropdown";
import { WeatherData } from "@/constants/constants";
import { getTemperature } from "@/hooks/getTemperature";

export const getDailyTempArr = (
  data: WeatherData,
  index: number,
  tempUnit: TempUnit
) => {
  return data.forecast.forecastday[index].hour.map((hour) =>
    getTemperature(hour.temp_c, tempUnit)
  );
};
