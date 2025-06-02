import { useWeatherData } from "@/hooks/useWeatherData";
import { getRainHourGraphData } from "./getRainHourGraphData";
import { interpolateRainData } from "./interpolateRainData";
import { use15MinRainData } from "./use15MinRainData";

export const useRainGraphData = (cityName: string) => {
  const data = useWeatherData();

  const { location } = data[cityName];

  const cityLat = location.lat;
  const cityLon = location.lon;

  const rain15MinData = use15MinRainData(cityLat, cityLon);

  // const rain15MinData = [0.30000001192092896, 0, 0, 0, 0];

  const rainData60Min = interpolateRainData(rain15MinData);
  const rainGraphData = getRainHourGraphData(rainData60Min);

  return rainGraphData.length ? rainGraphData : [{ minute: 0, mainBar: 0 }];
};
