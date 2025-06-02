import { Colors, colors } from "@/assets/colors/colors";
import { getPressure } from "@/hooks/useDisplayUnits";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useWeatherData } from "@/hooks/useWeatherData";
import { SkImage } from "@shopify/react-native-skia";
import React from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import { ChartImageArrayType, GraphDefaultY } from "../graphs/utils/constants";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { useForecastData } from "../graphs/utils/useForecastData";
import { getArrAverage } from "../helper-functions/helperFunctions";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import { getWeekArr } from "../utils/getWeekArr";
import { getOddPressureDirectionImages } from "./utils/getOddPressureDirectionImages";

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
  const { current } = data[cityName];
  const pressureUnit = useOtherUnits()["pressure"];

  const { state: airPressureState, isActive: airPressureIsActive } =
    useChartPressState({
      x: 0,
      y: GraphDefaultY,
    });
  const airPressureDragText = useAnimatedProps(() => {
    const airPressureVal = airPressureState.y.mainLine.value.value;
    const airPressure =
      (pressureUnit === "inHg"
        ? airPressureVal.toFixed(2)
        : Math.round(airPressureVal)) +
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

  const currentAirPressure = getPressure(current.pressure_in);
  const average = getArrAverage(getDayArr(data[cityName], id, "pressure_in"));

  const { pressureImgArr, trendForDay } = getOddPressureDirectionImages(
    data[cityName],
    id,
    true
  );

  const trendText =
    trendForDay === "up"
      ? "Rising"
      : trendForDay === "down"
      ? "Falling"
      : "Steady";

  const currentText: LeftTextType = {
    topText: twoDecimals(currentAirPressure).toFixed(2).toString(),
    topTextSmall: pressureUnit,
    bottomText: trendText,
  };

  const otherText: LeftTextType = {
    topText: twoDecimals(average).toString(),
    topTextSmall: pressureUnit,
    bottomText: trendText,
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

  const GraphContainerProps = {
    cityName,
    state: airPressureState,
    isActive: airPressureIsActive,
    scrollInfoBold: airPressureDragText,
    currentIndex,
  };

  const GraphProps = {
    graphData: pressureGraphData,
    cityName,
    state: airPressureState,
    isActive: airPressureIsActive,
    yAxisLabel: pressureUnit,
    loadedIndex: id,
    domainBottom: minRange - domainRange,
    domainTop: maxRange + domainRange,
    customColor: "bgPurple" as Colors,
    firstLineColor: colors.bgPurple(),
    chartImageArrays: [
      timeArr,
      pressureImgArr as SkImage[],
    ] as ChartImageArrayType,
  };

  return (
    <>
      <GraphContainer {...GraphContainerProps}>
        <Graph {...GraphProps} />
      </GraphContainer>
    </>
  );
};

export const twoDecimals = (x: number) => {
  "worklet";
  return Math.round(x * 100) / 100;
};

export default AirPressureModal;
