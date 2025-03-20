import { WeatherData } from "@/constants/constants";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import { useImage } from "@shopify/react-native-skia";

export const getOddConditionImages = (
  data: WeatherData,
  currentIndex: number
) => {
  const conditionArray =
    data.forecast &&
    data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
      return useImage(
        weatherNameToImage(getWeatherName(hour?.condition.code), hour?.is_day)
      );
    });

  const oddConditionImages = conditionArray.filter((img, index) => {
    if (index % 2 === 1) {
      return img;
    }
  });

  return oddConditionImages;
};
