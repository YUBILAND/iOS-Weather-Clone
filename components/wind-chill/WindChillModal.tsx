import { View, Text } from "react-native";
import React, { useEffect } from "react";
import GraphContainer from "../modal/GraphContainer";
import Graph from "../graphs/Graph";
import { useChartPressState } from "victory-native";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import WindChillModalDescription from "./WindChillModalDescription";
import { getArr } from "../air-pressure/utils/getAirPressureArr";
import WindChillLeftText from "./WindChillLeftText";
import { LeftTextType } from "../modal/Modal";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";

interface WindChillModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const WindChillModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: WindChillModalProps) => {
  const data = useWeatherData();

  const { state: windChillState, isActive: windChillIsActive } =
    useChartPressState({
      x: 0,
      y: {
        windChill: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });
  const windChillScrollInfoBold = useAnimatedProps(() => {
    const windChill = `${Math.round(windChillState.y.windChill.value.value)}°`;
    return {
      text: windChill,
      value: windChill,
    };
  });

  useSyncAnimatedValue(windChillIsActive, isActiveShared);

  const windChillArr = getArr(data[cityName], "windchill_c");
  const maxRange = Math.max(...windChillArr);
  const minRange = Math.min(...windChillArr);

  const currentWindChill = data[cityName].current.windchill_c;

  const dailyWindChillSpeed = data[cityName].forecast.forecastday[id].hour.map(
    (hour) => hour.windchill_c
  );
  const dailyMaxWindChill = Math.max(...dailyWindChillSpeed);
  const dailyMinWindChill = Math.min(...dailyWindChillSpeed);

  const hourlyTempMap = data[cityName].forecast?.forecastday[id].hour.map(
    (hour) => Math.round(parseFloat(hour.temp_c))
  );
  const maxCelsius = Math.max(...hourlyTempMap);
  const minCelsius = Math.min(...hourlyTempMap);

  const currentTemperature = data[cityName].current.temp_c;

  const currentText: LeftTextType = {
    topText: Math.round(currentWindChill) + "°".toString(),
    bottomText: `Actual: ${Math.round(parseFloat(currentTemperature)) + "°"}`,
  };

  const otherText: LeftTextType = {
    topText: Math.round(dailyMaxWindChill) + "°",
    topTextGray: Math.round(dailyMinWindChill) + "°",

    bottomText: `Actual H:${Math.round(maxCelsius) + "°"} L:${
      Math.round(minCelsius) + "°"
    }`,
  };

  updateLeftText(id, updateShared, currentText, otherText);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={windChillState}
        isActive={windChillIsActive}
        scrollInfoBold={windChillScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={
          <></>
          // <WindChillLeftText data={data[cityName]} id={id} />
        }
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={windChillState}
          isActive={windChillIsActive}
          yAxisLabel="°"
          loadedIndex={id}
          apiObjectString="windchill_c"
          domainBottom={minRange}
          domainTop={maxRange + 10}
          customColor="bgBlue"
          addWeatherImages
        />
      </GraphContainer>
    </>
  );
};

export default WindChillModal;
