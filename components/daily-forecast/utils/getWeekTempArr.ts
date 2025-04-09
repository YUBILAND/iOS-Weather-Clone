import { TempUnit } from "@/components/location-modal/SettingsDropdown";
import { WeatherData } from "@/constants/constants";
import { getTemperature } from "@/hooks/getTemperature";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";

export const getWeekTempArr = (data: WeatherData, tempUnit: TempUnit) => {
  let weekTempArr: number[] = [];

  for (let i = 0; i < 3; i++) {
    weekTempArr = [
      ...weekTempArr,
      ...data.forecast.forecastday[i].hour.map((hour) =>
        getTemperature(hour.temp_c, tempUnit)
      ),
    ];
  }

  return weekTempArr;
};
