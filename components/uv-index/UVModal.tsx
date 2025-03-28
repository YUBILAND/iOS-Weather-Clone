import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getUVLevel } from "./utils/getUVLevel";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";

interface UVModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const UVModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: UVModalProps) => {
  const data = useWeatherData();

  const { state: uvState, isActive: uvIsActive } = useChartPressState({
    x: 0,
    y: {
      uvIndex: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });

  const uvScrollInfoBold = useAnimatedProps(() => {
    const pressedValue = uvState.y.uvIndex.value.value;
    const uvIndex =
      `${Math.round(pressedValue)}` + " " + getUVLevel(pressedValue);
    return {
      text: uvIndex,
      value: uvIndex,
    };
  });

  // Updating isActive chartpress from parent.
  // Turns out assigning shared value within worklet results rerender, so use runOnJS
  useSyncAnimatedValue(uvIsActive, isActiveShared);

  const currentUVIndex = data[cityName].current.uv;

  const dailyUVArr = getDayArr(data[cityName], id, "uv");
  const dailyMax = Math.max(...dailyUVArr);

  const currentText: LeftTextType = {
    topText: Math.round(currentUVIndex).toString(),
    topTextSmall: getUVLevel(currentUVIndex),
    bottomText: "World Health Organization UVI",
  };
  const otherText: LeftTextType = {
    topText: Math.round(dailyMax).toString(),
    topTextSmall: getUVLevel(dailyMax),
    bottomText: "World Health Organization UVI",
  };

  // const currentText: LeftTextType = {
  //     topText: currentTemperature.toString() + "°",
  //     bottomText: `H:${maxCelsius}° L:${minCelsius}°`,
  //     image: "cloudy",
  //   };
  //   const otherText: LeftTextType = {
  //     topText: maxTemperature.toString() + "°",
  //     topTextGray: minTemperature + "°",
  //     bottomText: "Celsius",
  //   };

  updateLeftText(id, updateShared, currentText, otherText);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={uvState}
        isActive={uvIsActive}
        scrollInfoBold={uvScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<></>}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={uvState}
          isActive={uvIsActive}
          yAxisLabel="°"
          loadedIndex={id}
          apiObjectString="uv"
          domainTop={12}
          customColor="bgGreen"
          addWeatherText={{ unit: "" }}
        />
      </GraphContainer>

      {/* <UVModalDescription data={data[cityName]} currentIndex={id} /> */}
    </>
  );
};

export default React.memo(UVModal);
