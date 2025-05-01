import { getDistance } from "@/hooks/useDisplayUnits";
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
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { GraphDefaultY } from "../graphs/utils/constants";

interface VisibilityModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const VisibilityModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: VisibilityModalProps) => {
  const data = useWeatherData();
  const distanceUnit = useOtherUnits()["distance"];

  const { state: visState, isActive: visIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  const visScrollInfoBold = useAnimatedProps(() => {
    const vis = `${Math.round(visState.y.mainLine.value.value)}${distanceUnit}`;
    return {
      text: vis,
      value: vis,
    };
  });

  useSyncAnimatedValue(visIsActive, isActiveShared);

  const currentVisibility = Math.round(
    getDistance(data[cityName].current.vis_miles)
  );

  const { arrMax: dailyVisMax, arrMin: dailyVisMin } = getMinMaxArr(
    getDayArr(data[cityName], id, "vis_miles")
  );

  const currentText: LeftTextType = {
    topText: currentVisibility.toString(),
    topTextSmall: distanceUnit,
    bottomText: "Perfectly Clear",
  };

  const otherText: LeftTextType = {
    topText: Math.round(dailyVisMin) + " to " + Math.round(dailyVisMax),
    topTextSmall: distanceUnit,
    bottomText: "Perfectly Clear",
  };

  updateLeftText(id, updateShared, currentText, otherText);

  const { timeArr: timeArr, imageArr: visImageArr } = getGraphImageAndCoord(
    data[cityName],
    id,
    12,
    "vis_miles"
  );

  const visDayArr = getDayArr(data[cityName], id, "vis_miles");
  const visForecastWithoutMidnight = visDayArr.map((vis) => {
    return {
      mainLine: vis,
    };
  });
  const visAvgForecast = useForecastData(visForecastWithoutMidnight);
  const visGraphData = formatGraphDataCopy(data[cityName], visAvgForecast);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={visState}
        isActive={visIsActive}
        scrollInfoBold={visScrollInfoBold}
        currentIndex={currentIndex}
      >
        <Graph
          graphData={visGraphData}
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={visState}
          isActive={visIsActive}
          yAxisLabel="mi"
          loadedIndex={id}
          domainTop={distanceUnit === "mi" ? 10 : 30}
          customColor="bgWhite"
          chartImageArrays={[timeArr, visImageArr]}
        />
      </GraphContainer>
    </>
  );
};

export default VisibilityModal;
