import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import AirPressureModalDescription from "./AirPressureModalDescription";
import { getArr } from "./utils/getAirPressureArr";
import { LeftTextType } from "../modal/Modal";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";

interface AirPressureModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const AirPressureModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: AirPressureModalProps) => {
  const data = useWeatherData();

  const { state: airPressureState, isActive: airPressureIsActive } =
    useChartPressState({
      x: 0,
      y: {
        airPressure: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });
  const airPressureScrollInfoBold = useAnimatedProps(() => {
    const airPressure = `${airPressureState.y.airPressure.value.value} inHg`;
    return {
      text: airPressure,
      value: airPressure,
    };
  });

  useSyncAnimatedValue(airPressureIsActive, isActiveShared);

  const airPressureArr = getArr(data[cityName], "pressure_in");

  const maxRange = Math.max(...airPressureArr);
  const minRange = Math.min(...airPressureArr);

  const currentAirPressure = data[cityName].current.pressure_in;
  const dailyAirPressureArr = getDayArr(data[cityName], id, "pressure_in");
  const average = getArrAverage(dailyAirPressureArr);

  const currentText: LeftTextType = {
    topText: twoDecimals(currentAirPressure).toString(),
    topTextSmall: "inHg",
    bottomText: "Steady",
  };

  const otherText: LeftTextType = {
    topText: twoDecimals(average).toString(),
    topTextSmall: "inHg",
    bottomText: "Steady",
  };

  updateLeftText(id, updateShared, currentText, otherText);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={airPressureState}
        isActive={airPressureIsActive}
        scrollInfoBold={airPressureScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<></>}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={airPressureState}
          isActive={airPressureIsActive}
          yAxisLabel="in"
          loadedIndex={id}
          apiObjectString="pressure_in"
          domainBottom={minRange - 2}
          domainTop={maxRange + 2}
          customColor="bgPurple"
          removeArea
        />
      </GraphContainer>
    </>
  );
};

export const twoDecimals = (x: number) => {
  return Math.round(x * 100) / 100;
};

export const getArrAverage = (arr: number[]) => {
  const average = arr.reduce((acc, val) => acc + val, 0) / arr.length;

  return average;
};

export default AirPressureModal;
