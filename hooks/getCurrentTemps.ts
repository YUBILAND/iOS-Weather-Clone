import { getTemperature } from "./useDisplayUnits";
import { useWeatherData } from "./useWeatherData";

export const getCurrentTemps = (cityName: string) => {
  const data = useWeatherData();
  const { forecast, current } = data[cityName];
  const currentTemp = Math.round(getTemperature(current?.temp_c!));
  const currentHigh = Math.round(
    getTemperature(forecast?.forecastday[0].day.maxtemp_c!)
  );
  const currentLow = Math.round(
    getTemperature(forecast?.forecastday[0].day.mintemp_c!)
  );

  return { currentTemp, currentHigh, currentLow };
};
