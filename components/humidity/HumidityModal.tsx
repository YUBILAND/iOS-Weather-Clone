import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import { getArrAverage } from "../air-pressure/AirPressureModal";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import HumidityModalDescription from "./HumidityModalDescription";
import { LeftTextType } from "../modal/Modal";
import { useWeatherData } from "@/hooks/useWeatherData";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";

interface HumidityModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const HumidityModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: HumidityModalProps) => {
  const data = useWeatherData();

  const { state: humidityState, isActive: humidityIsActive } =
    useChartPressState({
      x: 0,
      y: {
        humidity: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });
  const humidityScrollInfoBold = useAnimatedProps(() => {
    const humidity = `${humidityState.y.humidity.value.value}%`;
    return {
      text: humidity,
      value: humidity,
    };
  });

  useSyncAnimatedValue(humidityIsActive, isActiveShared);

  const currentHumidity = data[cityName].current.humidity;
  const currentDewpoint = data[cityName].current.dewpoint_c;
  const dailyHumidityArr = getDayArr(data[cityName], id, "humidity");
  const average = getArrAverage(dailyHumidityArr);

  const currentText: LeftTextType = {
    topText: Math.round(currentHumidity) + "%",
    bottomText: "Dew point: " + Math.round(currentDewpoint) + "°",
  };

  const otherText: LeftTextType = {
    topText: Math.round(average) + "%",
    bottomText: "Average",
  };

  updateLeftText(id, updateShared, currentText, otherText);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={humidityState}
        isActive={humidityIsActive}
        scrollInfoBold={humidityScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<></>}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={humidityState}
          isActive={humidityIsActive}
          yAxisLabel="%"
          loadedIndex={id}
          apiObjectString="humidity"
          customColor="bgGreen"
          addWeatherText={{ amount: 4, unit: "%" }}
        />
      </GraphContainer>
    </>
  );
};

export default HumidityModal;
