import { WeatherData } from "@/constants/constants";
import { useImage } from "@shopify/react-native-skia";
import { pressureArrowImage } from "./pressureConstants";
import { ImageSourcePropType } from "react-native";

// Returns image array of pressure differential direction

export const getOddPressureDirectionImages = (
  data: WeatherData,
  currentIndex: number,
  skia: boolean = true
) => {
  const pressureArr = data.forecast?.forecastday[currentIndex]?.hour.map(
    (hour) => hour.pressure_in
  );

  const pressureArray = pressureArr.filter((pressure, index) => {
    if (index === 0 || index % 2 === 1 || index === pressureArr.length - 1) {
      return pressure;
    }
  });

  const pressureOffsetArray = pressureArray.slice(1).map((pressure, index) => {
    return pressure - pressureArray[index];
  });

  const pressureImagesArray = pressureOffsetArray.map((offset) => {
    if (offset > 0.01) {
      // Up Sign
      return skia
        ? useImage(pressureArrowImage["up"])
        : (pressureArrowImage["up"] as ImageSourcePropType);
    } else if (offset < -0.01) {
      // Down Sign
      return skia
        ? useImage(pressureArrowImage["down"])
        : (pressureArrowImage["down"] as ImageSourcePropType);
    } else {
      // Equal Sign
      return skia
        ? useImage(pressureArrowImage["equal"])
        : (pressureArrowImage["equal"] as ImageSourcePropType);
    }
  });

  return pressureImagesArray;
};
