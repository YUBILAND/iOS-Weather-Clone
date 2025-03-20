import { WeatherData } from "@/constants/constants";
import { useImage } from "@shopify/react-native-skia";
import { getArrowFromDegree } from "./getArrowFromDegree";

export const getOddWindDirectionImages = (
  data: WeatherData,
  currentIndex: number
) => {
  const windDirectionArray =
    data.forecast &&
    data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
      //north means from north to south so direcition of north should be pointing down, so add 180
      return useImage(getArrowFromDegree((hour.wind_degree + 180) % 360));
    });

  const oddWindDirectionImages = windDirectionArray.filter((img, index) => {
    if (index % 2 === 1) {
      return true;
    }
  });

  return oddWindDirectionImages;
};
