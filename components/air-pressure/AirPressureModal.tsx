import { getPressure } from "@/hooks/useDisplayUnits";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useWeatherData } from "@/hooks/useWeatherData";
import React from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import { getWeekArr } from "../utils/getWeekArr";
import { getOddPressureDirectionImages } from "./utils/getOddPressureDirectionImages";
import { Image, SkImage } from "@shopify/react-native-skia";
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { GraphDefaultY } from "../graphs/utils/constants";
import { View } from "react-native";
import { colors } from "@/assets/colors/colors";

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
  const pressureUnit = useOtherUnits()["pressure"];

  const { state: airPressureState, isActive: airPressureIsActive } =
    useChartPressState({
      x: 0,
      y:
        // {
        //   airPressure: 0,
        //   currentLineTop: 0,
        //   currentLineBottom: 0,
        //   currentPosition: 0,
        // },
        GraphDefaultY,
    });
  const airPressureScrollInfoBold = useAnimatedProps(() => {
    const airPressure =
      (pressureUnit === "inHg"
        ? airPressureState.y.mainLine.value.value.toFixed(2)
        : Math.round(airPressureState.y.mainLine.value.value)) +
      " " +
      pressureUnit;

    return {
      text: airPressure,
      value: airPressure,
    };
  });

  useSyncAnimatedValue(airPressureIsActive, isActiveShared);

  const { arrMax: maxRange, arrMin: minRange } = getMinMaxArr(
    getWeekArr(data[cityName], "pressure_in")
  );

  const currentAirPressure = getPressure(data[cityName].current.pressure_in);
  const average = getArrAverage(getDayArr(data[cityName], id, "pressure_in"));

  const currentText: LeftTextType = {
    topText: twoDecimals(currentAirPressure).toFixed(2).toString(),
    topTextSmall: pressureUnit,
    bottomText: "Steady",
  };

  const otherText: LeftTextType = {
    topText: twoDecimals(average).toString(),
    topTextSmall: pressureUnit,
    bottomText: "Steady",
  };

  updateLeftText(id, updateShared, currentText, otherText);

  const domainRange = ["mbar", "mmHg", "hPa"].includes(pressureUnit)
    ? 50
    : pressureUnit === "kPa"
    ? 5
    : 2;

  const { timeArr } = getGraphImageAndCoord(
    data[cityName],
    id,
    12,
    "condition.code"
  );

  const oddPressureDirectionImages = getOddPressureDirectionImages(
    data[cityName],
    id,
    true
  );

  const pressureDayArr = getDayArr(data[cityName], id, "pressure_in");
  const pressureForecastWithoutMidnight = pressureDayArr.map((pressure) => {
    return {
      mainLine: pressure,
    };
  });
  const pressureAvgForecast = useForecastData(pressureForecastWithoutMidnight);
  const pressureGraphData = formatGraphDataCopy(
    data[cityName],
    pressureAvgForecast
  );

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={airPressureState}
        isActive={airPressureIsActive}
        scrollInfoBold={airPressureScrollInfoBold}
        currentIndex={currentIndex}
      >
        <Graph
          graphData={pressureGraphData}
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={airPressureState}
          isActive={airPressureIsActive}
          yAxisLabel={pressureUnit}
          loadedIndex={id}
          domainBottom={minRange - domainRange}
          domainTop={maxRange + domainRange}
          customColor="bgPurple"
          firstLineColor={colors.bgPurple()}
          // removeArea
          // addPressureImages
          chartImageArrays={[timeArr, oddPressureDirectionImages as SkImage[]]}
        />
      </GraphContainer>
    </>
  );
};

export const twoDecimals = (x: number) => {
  "worklet";
  return Math.round(x * 100) / 100;
};

export const getArrAverage = (arr: number[]) => {
  const average = arr.reduce((acc, val) => acc + val, 0) / arr.length;

  return average;
};

export default AirPressureModal;
