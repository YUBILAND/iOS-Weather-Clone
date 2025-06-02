import { getNextHourRain } from "@/components/weather-screen/utils/getNextHourRain";
import { useEffect, useState } from "react";

export const use15MinRainData = (cityLat: number, cityLon: number) => {
  const [rain15MinData, setRain15MinData] = useState<number[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNextHourRain(cityLat, cityLon);
      if (data) {
        setRain15MinData(data.rain15MinData);
      }
    };

    fetchData();
  }, []);

  return rain15MinData;
};
