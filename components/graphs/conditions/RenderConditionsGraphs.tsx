import { View, Text, TextInputProps } from "react-native";
import React, { Key } from "react";
import GraphContainer, { ChartPressedState } from "../../modal/GraphContainer";
import TemperatureGraph from "../TemperatureGraph";
import { AnimatedProps } from "react-native-reanimated";
import TitleTemp from "./TitleTemp";
import { WeatherData } from "@/constants/constants";
import { ChartPressState } from "victory-native";
import DefaultText from "../../atoms/DefaultText";
import PrecipitationGraph from "../PrecipitationGraph";
import ModalDropdownContainer from "../../modal/dropdown/ModalDropdownContainer";

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
        <TemperatureGraph
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
        <PrecipitationGraph
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
