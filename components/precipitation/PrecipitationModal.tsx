import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import { removeZeroFromDecimal } from "../conditions/utils/removeZeroFromDecimal";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { getPrecipitation } from "@/hooks/useDisplayUnits";
import { getDayArr } from "./utils/getDayArr";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { GraphDefaultY } from "../graphs/utils/constants";
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { SkImage, useImage } from "@shopify/react-native-skia";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import Dot from "../modal/Dot";

interface PrecipitationModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const PrecipitationModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: PrecipitationModalProps) => {
  const data = useWeatherData();
  const precipUnit = useOtherUnits()["precipitation"];

  const { state: precipState, isActive: precipIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  useSyncAnimatedValue(precipIsActive, isActiveShared);
  const precipScrollInfoBold = useAnimatedProps(() => {
    const precip = `${precipState.y.mainLine.value.value}${
      precipUnit === "in" ? '"' : "mm"
    }`;
    return {
      text: precip,
      value: precip,
    };
  });

  // Left Text
  const totalRainfall = Math.round(
    getPrecipitation(data[cityName].forecast.forecastday[id].day.totalprecip_in)
  );
  const currentText = {
    topText:
      removeZeroFromDecimal(totalRainfall.toString()) +
      (precipUnit === "in" ? '"' : "mm"),
    bottomText: "Total in last 24 hours",
  };
  const otherText = {
    topText:
      removeZeroFromDecimal(totalRainfall.toString()) +
      (precipUnit === "in" ? '"' : "mm"),
    bottomText: "Total for the day",
  };
  updateLeftText(id, updateShared, currentText, otherText);

  // Get Graph Data
  const precipDayArr = getDayArr(data[cityName], id, "precip_in");
  const precipForecastWithoutMidnight = precipDayArr.map((precip) => {
    return {
      mainLine: precip,
    };
  });
  const precipAvgForecast = useForecastData(precipForecastWithoutMidnight);
  const precipGraphData = formatGraphDataCopy(
    data[cityName],
    precipAvgForecast
  );

  // Get Graph Images
  const { timeArr, imageArr } = getGraphImageAndCoord(
    data[cityName],
    id,
    12,
    "condition.code"
  );
  const weatherImageArr = imageArr.map((code, index) =>
    useImage(
      weatherNameToImage(
        getWeatherName(parseInt(code)),
        data[cityName].forecast.forecastday[id].hour[timeArr[index]].is_day
      )
    )
  );

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={precipState}
        isActive={precipIsActive}
        scrollInfoBold={precipScrollInfoBold}
        currentIndex={currentIndex}
      >
        <Graph
          graphData={precipGraphData}
          cityName={cityName}
          state={precipState}
          isActive={precipIsActive}
          yAxisLabel="in"
          loadedIndex={id}
          domainTop={1}
          customColor="bgBlue"
          firstLineColor={"lightblue"}
          chartImageArrays={[timeArr, weatherImageArr as SkImage[]]}
        />
      </GraphContainer>

      <Dot colorsArr={["red", "red"]} />
    </>
  );
};

export default PrecipitationModal;
