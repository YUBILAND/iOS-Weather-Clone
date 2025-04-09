import { WeatherData } from "@/constants/constants";
import React, { memo, useEffect } from "react";
import { TextInputProps, View } from "react-native";
import {
  AnimatedProps,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { ChartPressState, useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import TitleTemp from "../graphs/conditions/TitleTemp";
import GraphContainer from "../modal/GraphContainer";
import Graph from "../graphs/Graph";
import { getWeekTempArr } from "../daily-forecast/utils/getWeekTempArr";
import ConditionsModalDescription from "./ConditionsModalDescription";
import { LeftTextType } from "../modal/Modal";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import { getTemperature } from "@/hooks/getTemperature";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { getDailyTempArr } from "../daily-forecast/utils/getDailyTempArr";

interface RenderConditionsGraphsProps {
  data: WeatherData;
  cityName: string;
  currentIndex: number;
  item: { id: number };
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}

const RenderConditionsGraphs = ({
  data,
  cityName,
  item,
  currentIndex,
  updateShared,
  isActiveShared,
}: RenderConditionsGraphsProps) => {
  const tempUnit = useTemperatureUnit();

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

  const weekTempArr = getWeekTempArr(data, tempUnit);
  const weekMaxTemp = Math.max(...weekTempArr);
  const weekMinTemp = Math.min(...weekTempArr);

  useSyncAnimatedValue(tempIsActive, isActiveShared);
  // useSyncAnimatedValue(rainIsActive, isActiveShared);

  const hourlyTempMap = getDailyTempArr(data, 0, tempUnit);
  const maxCelsius = Math.round(Math.max(...hourlyTempMap));
  const minCelsius = Math.round(Math.min(...hourlyTempMap));

  const currentTemperature = Math.round(
    getTemperature(data.current?.temp_c, tempUnit)
  );
  const maxTemperature = Math.round(
    getTemperature(data.forecast?.forecastday[item.id].day.maxtemp_c, tempUnit)
  );
  const minTemperature = Math.round(
    getTemperature(data.forecast?.forecastday[item.id].day.mintemp_c, tempUnit)
  );

  // const currentWeatherImage = weatherNameToImage(
  //   getWeatherName(data.current?.condition.code),
  //   data.current?.is_day
  // );

  // const DailyWeatherImage = weatherNameToImage(
  //   getWeatherName(data.forecast?.forecastday[item.id].day.condition.code),
  //   true
  // );

  const currentText: LeftTextType = {
    topText: currentTemperature.toString() + "°",
    bottomText: `H:${maxCelsius}° L:${minCelsius}°`,
    image: "cloudy",
  };
  const otherText: LeftTextType = {
    topText: maxTemperature.toString() + "°",
    topTextGray: minTemperature + "°",
    bottomText: "Celsius",
  };

  updateLeftText(currentIndex, updateShared, currentText, otherText);

  return (
    <>
      {/* Temperature graph */}
      <GraphContainer
        cityName={cityName}
        state={tempState}
        isActive={tempIsActive}
        scrollInfoBold={tempScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={
          <></>
          // <TitleTemp data={data} item={item} />
        }
        hackyWeatherImage
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={tempState}
          isActive={tempIsActive}
          apiObjectString={tempUnit === "celsius" ? "temp_c" : "temp_f"}
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
    </>
  );
};

export default React.memo(RenderConditionsGraphs);
