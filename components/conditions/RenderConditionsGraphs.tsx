import { WeatherData } from "@/constants/constants";
import React, { memo } from "react";
import { TextInputProps, View } from "react-native";
import { AnimatedProps } from "react-native-reanimated";
import { ChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import ChanceOfRainGraph from "../chance-of-rain/ChanceOfRainGraph";
import TitleTemp from "../graphs/conditions/TitleTemp";
import TemperatureGraph from "../hourly-forecast/TemperatureGraph";
import GraphContainer from "../modal/GraphContainer";

interface RenderConditionsGraphsProps {
  data: WeatherData;
  cityName: string;
  tempState: ChartPressState<{
    x: number;
    y: {
      celsius: number;
      currentLineTop: number;
      currentLineBottom: number;
      currentPosition: number;
    };
  }>;
  tempIsActive: boolean;
  rainState: ChartPressState<{
    x: number;
    y: {
      chanceOfRain: number;
      currentLineTop: number;
      currentLineBottom: number;
      currentPosition: number;
    };
  }>;
  rainIsActive: boolean;

  tempScrollInfoBold: Partial<AnimatedProps<TextInputProps>>;
  rainScrollInfoBold: Partial<AnimatedProps<TextInputProps>>;

  currentIndex: number;
  item: { id: number };
}

const TemperatureGraphMemo = memo(TemperatureGraph);
const ChanceOfRainGraphMemo = memo(ChanceOfRainGraph);

const RenderConditionsGraphs = ({
  data,
  cityName,
  item,
  tempState,
  tempIsActive,
  rainState,
  rainIsActive,
  tempScrollInfoBold,
  rainScrollInfoBold,
  currentIndex,
}: RenderConditionsGraphsProps) => {
  return (
    <>
      {/* Temperature graph */}
      <GraphContainer
        cityName={cityName}
        state={tempState}
        isActive={tempIsActive}
        hackyWeatherImage
        scrollInfoBold={tempScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<TitleTemp data={data} item={item} />}
      >
        <TemperatureGraphMemo
          cityName={cityName}
          state={tempState}
          isActive={tempIsActive}
          graphHeight={200}
          strokeWidth={4}
          yAxisLabel="°"
          currentIndex={item.id}
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
              Rain Probability
            </DefaultText>
          </View>
        }
      >
        <ChanceOfRainGraphMemo
          cityName={cityName}
          state={rainState}
          isActive={rainIsActive}
          graphHeight={200}
          strokeWidth={4}
          yAxisLabel="%"
          currentIndex={item.id}
        />
      </GraphContainer>
    </>
  );
};

export default RenderConditionsGraphs;
