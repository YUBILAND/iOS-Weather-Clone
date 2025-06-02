import { Colors } from "@/assets/colors/colors";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useExtraData, useWeatherData } from "@/hooks/useWeatherData";
import React from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import { ChartImageArrayType, GraphDefaultY } from "../graphs/utils/constants";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import {
  chunkenArray,
  getCurrentVis,
  getVisImageArr,
  getVisMessage,
} from "./helper/helper-functions";
import { getArrAverage } from "../helper-functions/helperFunctions";

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
  const { location } = data[cityName];
  const distanceUnit = useOtherUnits()["distance"];

  const { state: visState, isActive: visIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  const visDragText = useAnimatedProps(() => {
    const visVal = visState.y.mainLine.value.value;
    const vis = `${Math.round(visVal)}${distanceUnit}`;
    return {
      text: vis,
      value: vis,
    };
  });

  // Sync IsActive shared value and state
  useSyncAnimatedValue(visIsActive, isActiveShared);

  const extraData = useExtraData();

  const visData = extraData[cityName].visData;
  const visChunkArr = chunkenArray(visData);

  const currentVis = getCurrentVis(visChunkArr, location);

  const currentTopText = Math.round(currentVis).toString();
  const visMessage = getVisMessage(Math.round(currentVis));
  const currentText: LeftTextType = {
    topText: currentTopText,
    topTextSmall: distanceUnit,
    bottomText: visMessage,
  };

  const { arrMax: visDailyMax, arrMin: visDailyMin } = getMinMaxArr(
    visChunkArr[id]
  );

  const otherTopText =
    Math.round(visDailyMin) + " to " + Math.round(visDailyMax);
  const visAvg = getArrAverage(visChunkArr[id]);
  const otherText: LeftTextType = {
    topText: otherTopText,
    topTextSmall: distanceUnit,
    bottomText: getVisMessage(visAvg),
  };

  updateLeftText(id, updateShared, currentText, otherText);

  // Produce Graph Data
  const visPrematureGraphData = visChunkArr[id].map((vis) => {
    return {
      mainLine: vis,
    };
  });
  const visGraphData = formatGraphDataCopy(
    data[cityName],
    visPrematureGraphData
  );

  // Get max for calculating graph Y range to fit data in viewpoint
  const { arrMax: visMax } = getMinMaxArr(visData);

  // Text at top of graph
  const { timeArr, visImageArr } = getVisImageArr(visChunkArr, id);

  const GraphContainerProps = {
    cityName,
    state: visState,
    isActive: visIsActive,
    scrollInfoBold: visDragText,
    currentIndex: currentIndex,
  };

  const GraphProps = {
    graphData: visGraphData,
    cityName,
    state: visState,
    isActive: visIsActive,
    yAxisLabel: "mi",
    loadedIndex: id,
    domainTop: distanceUnit === "mi" ? visMax + 10 : 100,
    customColor: "bgWhite" as Colors,
    chartImageArrays: [timeArr, visImageArr] as ChartImageArrayType,
  };

  return (
    <>
      <GraphContainer {...GraphContainerProps}>
        <Graph {...GraphProps} />
      </GraphContainer>
    </>
  );
};

export default VisibilityModal;
