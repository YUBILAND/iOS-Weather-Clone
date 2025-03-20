import { WeatherData } from "@/constants/constants";
import React, { memo, useEffect } from "react";
import { TextInputProps, View } from "react-native";
import { AnimatedProps, useAnimatedProps } from "react-native-reanimated";
import { ChartPressState, useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import TitleTemp from "../graphs/conditions/TitleTemp";
import GraphContainer from "../modal/GraphContainer";
import Graph from "../graphs/Graph";
import { getWeekTempArr } from "../daily-forecast/utils/getWeekTempArr";
import ConditionsModalDescription from "./ConditionsModalDescription";

interface RenderConditionsGraphsProps {
  data: WeatherData;
  cityName: string;
  currentIndex: number;
  item: { id: number };

  handleActivePress: (active: boolean) => void;
}

const RenderConditionsGraphs = ({
  data,
  cityName,
  item,
  currentIndex,
  handleActivePress,
}: RenderConditionsGraphsProps) => {
  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: {
      celsius: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const tempScrollInfoBold = useAnimatedProps(() => {
    const celsius = `${Math.round(tempState.y.celsius.value.value)}°`;
    return {
      text: celsius,
      value: celsius,
    };
  });

  const { state: rainState, isActive: rainIsActive } = useChartPressState({
    x: 0,
    y: {
      chanceOfRain: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const rainScrollInfoBold = useAnimatedProps(() => {
    const chanceOfRain = `${Math.round(rainState.y.chanceOfRain.value.value)}%`;
    return {
      text: chanceOfRain,
      value: chanceOfRain,
    };
  });

  const weekTempArr = getWeekTempArr(data);
  const weekMaxTemp = Math.max(...weekTempArr);
  const weekMinTemp = Math.min(...weekTempArr);

  useEffect(() => {
    handleActivePress(tempIsActive);
  }, [tempIsActive]);

  useEffect(() => {
    handleActivePress(rainIsActive);
  }, [rainIsActive]);

  return (
    <>
      {/* Temperature graph */}
      <GraphContainer
        cityName={cityName}
        state={tempState}
        isActive={tempIsActive}
        scrollInfoBold={tempScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<TitleTemp data={data} item={item} />}
        hackyWeatherImage
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={tempState}
          isActive={tempIsActive}
          apiObjectString="temp_c"
          graphHeight={200}
          yAxisLabel="°"
          domainTop={weekMaxTemp + 10}
          domainBottom={weekMinTemp - 10}
          loadedIndex={item.id}
          addWeatherImages
        />
      </GraphContainer>

      {/* Precipitation graph */}
      <GraphContainer
        cityName={cityName}
        state={rainState}
        isActive={rainIsActive}
        scrollInfoBold={rainScrollInfoBold}
        smallBold
        currentIndex={item.id}
        leftSide={
          <View className="h-12" style={{ justifyContent: "center" }}>
            <DefaultText className="text-2xl font-semibold ">
              Chance of Precipitation
            </DefaultText>
          </View>
        }
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={rainState}
          isActive={rainIsActive}
          graphHeight={200}
          apiObjectString="chance_of_rain"
          yAxisLabel="%"
          loadedIndex={item.id}
        />
      </GraphContainer>

      <ConditionsModalDescription data={data} currentIndex={item.id} />
    </>
  );
};

export default RenderConditionsGraphs;
