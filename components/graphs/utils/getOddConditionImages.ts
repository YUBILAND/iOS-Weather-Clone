import { WeatherData, weatherKey, WeatherType } from "@/constants/constants";
import { useImage } from "@shopify/react-native-skia";
import { weatherPNG } from "@/utils/exampleForecast";

export const getOddConditionImages = (
  data: WeatherData,
  currentIndex: number
) => {
  const conditionArray =
    data.forecast &&
    data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
      return useImage(
        weatherKey[
          weatherPNG(
            hour.condition.text.toLowerCase() as WeatherType,
            hour.is_day
          )
        ]
      );
    });

  const oddConditionImages = conditionArray.filter((img, index) => {
    if (index % 2 === 1) {
      return img;
    }
  });
  return oddConditionImages;
};
