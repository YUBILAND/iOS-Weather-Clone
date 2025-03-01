import { WeatherData } from "@/constants/constants";

export const getAQI = (data: WeatherData) =>
  Math.round(
    Math.max(data.current?.air_quality.o3, data.current?.air_quality.pm2_5)
  );
