import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import HumidityModalDescription from "./HumidityModalDescription";
import { LeftTextType } from "../modal/Modal";
import { useWeatherData } from "@/hooks/useWeatherData";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { GraphDefaultY } from "../graphs/utils/constants";
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { getArrAverage } from "../helper-functions/helperFunctions";

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
      y: GraphDefaultY,
    });
  useSyncAnimatedValue(humidityIsActive, isActiveShared);
  const humidityScrollInfoBold = useAnimatedProps(() => {
    const humidity = `${humidityState.y.mainLine.value.value}%`;
    return {
      text: humidity,
      value: humidity,
    };
  });

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

  const humidityDayArr = getDayArr(data[cityName], id, "humidity");
  const humidityForecastWithoutMidnight = humidityDayArr.map((humidity) => {
    return {
      mainLine: humidity,
    };
  });
  const humidityAvgForecast = useForecastData(humidityForecastWithoutMidnight);
  const humidityGraphData = formatGraphDataCopy(
    data[cityName],
    humidityAvgForecast
  );

  const { timeArr: timeArr, imageArr: humidityArr } = getGraphImageAndCoord(
    data[cityName],
    id,
    4,
    "humidity"
  );

  const humidityArrWithUnit = humidityArr.map((humidity) => humidity + "%");

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={humidityState}
        isActive={humidityIsActive}
        scrollInfoBold={humidityScrollInfoBold}
        currentIndex={currentIndex}
      >
        <Graph
          graphData={humidityGraphData}
          cityName={cityName}
          state={humidityState}
          isActive={humidityIsActive}
          yAxisLabel="%"
          loadedIndex={id}
          customColor="bgGreen"
          firstLineColor={"green"}
          chartImageArrays={[timeArr, humidityArrWithUnit]}
        />
      </GraphContainer>
    </>
  );
};

export default HumidityModal;
