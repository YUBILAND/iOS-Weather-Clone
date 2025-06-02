import { getNextHourRain } from "@/components/weather-screen/utils/getNextHourRain";
import { WeatherData } from "@/constants/constants";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useEffect, useState } from "react";

export const useRainData = (weatherScreens: string[]) => {
  const data = useWeatherData();
  const [rainData, setRainData] = useState<number[][]>([]);
  const [isRainLoading, setIsRainLoading] = useState(true);
  const [visData, setVisData] = useState<number[][]>([]);

  useEffect(() => {
    const fetchRainData = async () => {
      setIsRainLoading(true);
      try {
        const screenRainData = await Promise.all(
          weatherScreens.map(async (city) => {
            const { cityLat, cityLon } = getCityLoc(data[city]);
            const rainData = await getNextHourRain(cityLat, cityLon);

            if (!rainData) throw new Error(`Failed to fetch for ${city}`);

            return rainData;
          })
        );

        setRainData(screenRainData.map((data) => data.rain15MinData));
        setVisData(screenRainData.map((data) => data.vis3DayData));
      } catch (e) {
        console.error("Error fetching rain data", e);
      } finally {
        setIsRainLoading(false);
      }
    };

    // Check if weatherScreens and data is valid before fetching data
    const isCityDataFetched =
      weatherScreens &&
      data &&
      weatherScreens.length > 0 &&
      weatherScreens.every((city) => data[city]?.location);

    isCityDataFetched && fetchRainData();
  }, [weatherScreens, data]);

  return { rainData, isRainLoading, visData };
};

const getCityLoc = (cityData: WeatherData) => {
  const cityLat = cityData.location.lat;
  const cityLon = cityData.location.lon;

  return { cityLat, cityLon };
};
