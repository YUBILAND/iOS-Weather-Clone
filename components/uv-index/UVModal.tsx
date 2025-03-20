import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useEffect } from "react";
import { useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import UVModalDescription from "./UVModalDescription";
import { getUVLevel } from "./utils/getUVLevel";

interface UVModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  handleActivePress: (active: boolean) => void;
}
const UVModal = ({
  cityName,
  currentIndex,
  id,
  handleActivePress,
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

  useEffect(() => {
    handleActivePress(uvIsActive);
  }, [uvIsActive]);

  const currentUVIndex = data[cityName].current.uv;

  const dailyUVArr = getDayArr(data[cityName], id, "uv");
  const dailyMax = Math.max(...dailyUVArr);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={uvState}
        isActive={uvIsActive}
        scrollInfoBold={uvScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={
          <GraphLeftText
            id={id}
            currentTopText={
              Math.round(currentUVIndex) + " " + getUVLevel(currentUVIndex)
            }
            otherTopText={Math.round(dailyMax) + " " + getUVLevel(dailyMax)}
            currentBottomText="World Health Organization UVI"
            otherBottomText="World Health Organization UVI"
          />
        }
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={uvState}
          isActive={uvIsActive}
          graphHeight={250}
          strokeWidth={4}
          yAxisLabel="°"
          loadedIndex={id}
          apiObjectString="uv"
          domainBottom={0}
          domainTop={12}
          customColor="bgGreen"
          addWeatherText={{ unit: "" }}
        />
      </GraphContainer>

      <UVModalDescription data={data[cityName]} currentIndex={id} />
    </>
  );
};

export default UVModal;
