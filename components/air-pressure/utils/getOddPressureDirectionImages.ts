import { WeatherData } from "@/constants/constants";
import { useImage } from "@shopify/react-native-skia";
import { pressureArrowImage } from "./pressureConstants";
import { ImageSourcePropType } from "react-native";
import { getDayArr } from "@/components/precipitation/utils/getDayArr";

// Returns image array of pressure differential direction

export const getOddPressureDirectionImages = (
  data: WeatherData,
  currentIndex: number,
  wantSkiaImage: boolean = true
) => {
  // Get Pressure Array for currentIndex
  const pressureDayArr = getDayArr(data, currentIndex, "pressure_in");
  const pressureArr = pressureDayArr.filter((_, index) => {
    return (
      index === 0 || index % 2 === 1 || index === pressureDayArr.length - 1
    );
  });

  // Array of the number difference between each element
  const pressureOffsetArr = pressureArr.slice(1).map((pressure, index) => {
    return pressure - pressureArr[index];
  });

  // Get Image Arr of Arrows
  const pressureImgArr = pressureOffsetArr.map((offset) => {
    if (offset > 0.01) {
      // Up Sign
      return wantSkiaImage
        ? useImage(pressureArrowImage["up"])
        : (pressureArrowImage["up"] as ImageSourcePropType);
    } else if (offset < -0.01) {
      // Down Sign
      return wantSkiaImage
        ? useImage(pressureArrowImage["down"])
        : (pressureArrowImage["down"] as ImageSourcePropType);
    } else {
      // Equal Sign
      return wantSkiaImage
        ? useImage(pressureArrowImage["equal"])
        : (pressureArrowImage["equal"] as ImageSourcePropType);
    }
  });

  const pressureTextArr: ("up" | "down" | "equal")[] = pressureOffsetArr.map(
    (offset) => {
      if (offset > 0.01) {
        // Up Sign
        return "up";
      } else if (offset < -0.01) {
        // Down Sign
        return "down";
      } else {
        // Equal Sign
        return "equal";
      }
    }
  );

  const findMajorityElement = (arr: ("up" | "down" | "equal")[]) => {
    let currentMajority = arr[0];
    let currentCount = 1;

    for (let i = 0; i < arr.length; i++) {
      if (currentCount < 0) {
        currentMajority = arr[i];
      }
      arr[i] === currentMajority ? currentCount++ : currentCount--;

      // if (currentCount > Math.floor(arr.length / 3)) ;
    }

    return currentMajority;
  };
  const trendForDay = findMajorityElement(pressureTextArr);

  return { pressureImgArr, trendForDay };
};
