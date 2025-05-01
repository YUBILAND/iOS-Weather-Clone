import { WeatherData } from "@/constants/constants";
import { getCurrentHour } from "@/hooks/hooks";

export const get24HrRainfall = (data: WeatherData) => {
  const currentHour = getCurrentHour(data.location.tz_id);

  const last24HrRainfall = data.forecast.forecastday[0].hour.reduce(
    (acc, hour, index) => {
      if (index <= currentHour) {
        return (acc += hour.precip_in);
      }
      return acc;
    },
    0
  );

  let next24HrRainfall = data.forecast.forecastday[0].hour.reduce(
    (acc, hour, index) => {
      if (index >= currentHour) {
        return (acc += hour.precip_in);
      }
      return acc;
    },
    0
  );

  next24HrRainfall = data.forecast.forecastday[1].hour.reduce(
    (acc, hour, index) => {
      if (index <= currentHour) {
        return (acc += hour.precip_in);
      }
      return acc;
    },
    0
  );

  return { last24HrRainfall, next24HrRainfall };
};
