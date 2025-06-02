import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getUVLevel } from "./utils/getUVLevel";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { GraphDefaultY } from "../graphs/utils/constants";
import { Colors, colors } from "@/assets/colors/colors";

interface UVModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const UVModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: UVModalProps) => {
  const data = useWeatherData();

  const { state: uvState, isActive: uvIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });

  const uvDragText = useAnimatedProps(() => {
    const pressedValue = uvState.y.mainLine.value.value;
    const uvIndex =
      `${Math.round(pressedValue)}` + " " + getUVLevel(pressedValue);
    return {
      text: uvIndex,
      value: uvIndex,
    };
  });

  // Updating isActive chartpress from parent.
  // Turns out assigning shared value within worklet results rerender, so use runOnJS
  useSyncAnimatedValue(uvIsActive, isActiveShared);

  const { currentText, otherText } = (() => {
    const currentUVIndex = data[cityName].current.uv;
    const dailyUVArr = getDayArr(data[cityName], id, "uv");
    const dailyMax = Math.max(...dailyUVArr);

    const currentText: LeftTextType = {
      topText: Math.round(currentUVIndex).toString(),
      topTextSmall: getUVLevel(currentUVIndex),
      bottomText: "World Health Organization UVI",
    };
    const otherText: LeftTextType = {
      topText: Math.round(dailyMax).toString(),
      topTextSmall: getUVLevel(dailyMax),
      bottomText: "World Health Organization UVI",
    };
    return { currentText, otherText };
  })();

  updateLeftText(id, updateShared, currentText, otherText);

  const uvGraphData = (() => {
    const uvDayArr = getDayArr(data[cityName], id, "uv");
    const uvForecastWithoutMidnight = uvDayArr.map((uv) => {
      return {
        mainLine: uv,
      };
    });
    const uvAvgForecast = useForecastData(uvForecastWithoutMidnight);
    const uvGraphData = formatGraphDataCopy(data[cityName], uvAvgForecast);

    return uvGraphData;
  })();

  const GraphContainerProps = {
    cityName,
    state: uvState,
    isActive: uvIsActive,
    scrollInfoBold: uvDragText,
    currentIndex,
  };

  const GraphProps = {
    graphData: uvGraphData,
    cityName,
    state: uvState,
    isActive: uvIsActive,
    yAxisLabel: "°",
    loadedIndex: id,
    domainTop: 12,
    customColor: "bgGreen" as Colors,
    firstLineColor: "green",
  };
  return (
    <>
      <GraphContainer {...GraphContainerProps}>
        <Graph {...GraphProps} />
      </GraphContainer>
    </>
  );
};

export default React.memo(UVModal);
