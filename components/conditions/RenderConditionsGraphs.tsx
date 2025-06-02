import { WeatherData } from "@/constants/constants";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import React from "react";
import { View } from "react-native";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { getWeekArr } from "../utils/getWeekArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import { getTemperature } from "@/hooks/useDisplayUnits";
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { SkImage, useImage } from "@shopify/react-native-skia";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { useForecastData } from "../graphs/utils/useForecastData";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { ChartImageArrayType, GraphDefaultY } from "../graphs/utils/constants";
import { useWeatherData } from "@/hooks/useWeatherData";

interface RenderConditionsGraphsProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}

const RenderConditionsGraphs = ({
  cityName,
  id,
  currentIndex,
  updateShared,
  isActiveShared,
}: RenderConditionsGraphsProps) => {
  const data = useWeatherData();
  const cityData = data[cityName];
  const { location, forecast, current } = data[cityName];

  const tempUnit = useTemperatureUnit();

  // Temperature Graph Chart Press State
  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  // Sync boolean isActive to Shared Value isActive
  useSyncAnimatedValue(tempIsActive, isActiveShared);

  // Temperature Drag Text
  const tempDragText = useAnimatedProps(() => {
    const tempVal = tempState.y.mainLine.value.value;
    const celsius = Math.round(tempVal) + "°";
    return {
      text: celsius,
      value: celsius,
    };
  });

  // Chance of Rain Graph Chart Press State
  const { state: rainState, isActive: rainIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  // Chance of Rain Drag Text
  const chanceOfRainDragText = useAnimatedProps(() => {
    const rainVal = rainState.y.mainLine.value.value;
    const chanceOfRain = Math.round(rainVal) + "%";
    return {
      text: chanceOfRain,
      value: chanceOfRain,
    };
  });

  // Temperature Range for the Week
  const { arrMax: weekTempHigh, arrMin: weekTempLow } = getMinMaxArr(
    getWeekArr(cityData, "temp_c")
  );

  // Temperature data for condition
  const getConditionTemps = () => {
    const dayArr = forecast?.forecastday[id].day;
    const currentTemp = Math.round(getTemperature(current?.temp_c));
    const maxTemp = Math.round(getTemperature(dayArr.maxtemp_c));
    const minTemp = Math.round(getTemperature(dayArr.mintemp_c));
    return { currentTemp, maxTemp, minTemp };
  };
  const { currentTemp, maxTemp, minTemp } = getConditionTemps();

  const getCurrentConditionImg = () => {
    const currentCode = current.condition.code;
    const isDay = current.is_day;
    console.log(getWeatherName(currentCode), isDay);
    return weatherNameToImage(getWeatherName(currentCode), isDay);
  };

  // Left Text
  const currentText: LeftTextType = {
    topText: currentTemp.toString() + "°",
    bottomText: `H:${maxTemp}° L:${minTemp}°`,
    image: getCurrentConditionImg(),
  };
  const otherText: LeftTextType = {
    topText: maxTemp.toString() + "°",
    topTextGray: minTemp + "°",
    bottomText: tempUnit.charAt(0).toUpperCase() + tempUnit.slice(1),
  };
  // Change shared value leftText on scroll
  updateLeftText(currentIndex, updateShared, currentText, otherText);

  // Graph Images
  const { timeArr, imageArr } = getGraphImageAndCoord(
    cityData,
    id,
    12,
    "condition.code"
  );
  const hourArr = forecast.forecastday[id].hour;
  const weatherImageArr = imageArr.map((code, index) =>
    useImage(
      weatherNameToImage(
        getWeatherName(parseInt(code)),
        hourArr[timeArr[index]].is_day
      )
    )
  );

  // Get Temp Graph Data
  const tempDayArr = getDayArr(cityData, currentIndex, "temp_c");
  const tempForecastWithoutMidnight = tempDayArr.map((temp) => {
    return {
      mainLine: temp,
    };
  });
  const tempAvgForecast = useForecastData(tempForecastWithoutMidnight);
  const tempGraphData = formatGraphDataCopy(cityData, tempAvgForecast);

  // Get Chance of Rain Graph Data
  const chanceOfRainDayArr = getDayArr(
    cityData,
    currentIndex,
    "chance_of_rain"
  );
  const chanceOfRainForecastWithoutMidnight = chanceOfRainDayArr.map(
    (chanceOfRain) => {
      return {
        mainLine: chanceOfRain,
      };
    }
  );
  const chanceOfRainAvgForecast = useForecastData(
    chanceOfRainForecastWithoutMidnight
  );
  const chanceOfRainGraphData = formatGraphDataCopy(
    cityData,
    chanceOfRainAvgForecast
  );

  const TempGraphContainerProps = {
    cityName,
    state: tempState,
    isActive: tempIsActive,
    scrollInfoBold: tempDragText,
    currentIndex: currentIndex,
    hackyWeatherImage: true,
  };
  const TempGraphProps = {
    graphData: tempGraphData,
    cityName,
    state: tempState,
    isActive: tempIsActive,
    graphHeight: 200,
    yAxisLabel: "°",
    domainTop: weekTempHigh + 10,
    domainBottom: weekTempLow - 10,
    loadedIndex: id,
    chartImageArrays: [
      timeArr,
      weatherImageArr as SkImage[],
    ] as ChartImageArrayType,
    firstLineColor: "lightblue",
  };
  const PrecipGraphContainerProps = {
    cityName,
    state: rainState,
    isActive: rainIsActive,
    scrollInfoBold: chanceOfRainDragText,
    smallBold: true,
    currentIndex: id,
  };
  const PrecipGraphProps = {
    graphData: chanceOfRainGraphData,
    cityName,
    state: rainState,
    isActive: rainIsActive,
    graphHeight: 200,
    yAxisLabel: "%",
    loadedIndex: id,
    firstLineColor: "lightblue",
  };
  return (
    <>
      {/* Temperature graph */}
      <GraphContainer {...TempGraphContainerProps}>
        <Graph {...TempGraphProps} />
      </GraphContainer>

      {/* Precipitation graph */}
      <GraphContainer {...PrecipGraphContainerProps}>
        <Graph {...PrecipGraphProps} />
      </GraphContainer>
    </>
  );
};

export default React.memo(RenderConditionsGraphs);
