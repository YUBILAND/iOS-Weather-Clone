import { WeatherData, weatherKey, WeatherType } from "@/constants/constants";
import { useImage } from "@shopify/react-native-skia";
import { weatherPNG } from "@/utils/exampleForecast";
import { Ionicons } from "@expo/vector-icons";
import { getArrowFromDegree } from "./getArrowFromDegree";

export const getOddWindDirectionImages = (
  data: WeatherData,
  currentIndex: number
) => {
  const windDirectionArray =
    data.forecast &&
    data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
      return useImage(getArrowFromDegree(hour.wind_degree));
    });

  const oddWindDirectionImages = windDirectionArray.filter((img, index) => {
    if (index % 2 === 1) {
      return true;
    }
  });

  return oddWindDirectionImages;
};
