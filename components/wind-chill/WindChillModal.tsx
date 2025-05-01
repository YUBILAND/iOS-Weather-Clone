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
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { SkImage, useImage } from "@shopify/react-native-skia";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import { getTemperature } from "@/hooks/useDisplayUnits";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { GraphDefaultY } from "../graphs/utils/constants";

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
      y: GraphDefaultY,
    });
  const windChillScrollInfoBold = useAnimatedProps(() => {
    const windChill = `${Math.round(windChillState.y.mainLine.value.value)}°`;
    return {
      text: windChill,
      value: windChill,
    };
  });

  useSyncAnimatedValue(windChillIsActive, isActiveShared);

  const { arrMax: maxRange, arrMin: minRange } = getMinMaxArr(
    getWeekArr(data[cityName], "windchill_c")
  );

  const currentWindChill = getTemperature(data[cityName].current.windchill_c);

  const { arrMax: dailyMaxWindChill, arrMin: dailyMinWindChill } = getMinMaxArr(
    getDayArr(data[cityName], id, "windchill_c")
  );

  const { arrMax: maxCelsius, arrMin: minCelsius } = getMinMaxArr(
    getDayArr(data[cityName], id, "temp_c")
  );

  const currentTemperature = getTemperature(data[cityName].current.temp_c);

  const currentText: LeftTextType = {
    topText: Math.round(currentWindChill) + "°".toString(),
    bottomText: `Actual: ${Math.round(currentTemperature) + "°"}`,
  };

  const otherText: LeftTextType = {
    topText: Math.round(dailyMaxWindChill) + "°",
    topTextGray: Math.round(dailyMinWindChill) + "°",
    bottomText: `Actual H:${Math.round(maxCelsius) + "°"} L:${
      Math.round(minCelsius) + "°"
    }`,
  };

  updateLeftText(id, updateShared, currentText, otherText);

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

  const feelsLikeDayArr = getDayArr(data[cityName], id, "windchill_c");

  const feelsLikeForecastWithoutMidnight = feelsLikeDayArr.map((feelsLike) => {
    return {
      mainLine: feelsLike,
    };
  });
  const feelsLikeAvgForecast = useForecastData(
    feelsLikeForecastWithoutMidnight
  );
  const feelsLikeGraphData = formatGraphDataCopy(
    data[cityName],
    feelsLikeAvgForecast
  );

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={windChillState}
        isActive={windChillIsActive}
        scrollInfoBold={windChillScrollInfoBold}
        currentIndex={currentIndex}
      >
        <Graph
          graphData={feelsLikeGraphData}
          cityName={cityName}
          state={windChillState}
          isActive={windChillIsActive}
          yAxisLabel="°"
          loadedIndex={id}
          domainBottom={minRange - 5}
          domainTop={maxRange + 10}
          customColor="bgBlue"
          firstLineColor={"lightblue"}
          chartImageArrays={[timeArr, weatherImageArr as SkImage[]]}
        />
      </GraphContainer>
    </>
  );
};

export default WindChillModal;
