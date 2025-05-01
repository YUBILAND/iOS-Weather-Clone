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
import { GraphDefaultY } from "../graphs/utils/constants";

interface RenderConditionsGraphsProps {
  data: WeatherData;
  cityName: string;
  currentIndex: number;
  item: { id: number };
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}

const RenderConditionsGraphs = ({
  data,
  cityName,
  item,
  currentIndex,
  updateShared,
  isActiveShared,
}: RenderConditionsGraphsProps) => {
  const tempUnit = useTemperatureUnit();

  // Temperature Graph Chart Press State
  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  // Allows the JS thread tempIsActive to sync with UI thread isActiveShared
  useSyncAnimatedValue(tempIsActive, isActiveShared);
  // Temperature Drag Text
  const tempDragText = useAnimatedProps(() => {
    const celsius = `${Math.round(tempState.y.mainLine.value.value)}°`;
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
    const chanceOfRain = `${Math.round(rainState.y.mainLine.value.value)}%`;
    return {
      text: chanceOfRain,
      value: chanceOfRain,
    };
  });

  // Week Temperature Range
  const { arrMax: weekTempHigh, arrMin: weekTempLow } = getMinMaxArr(
    getWeekArr(data, "temp_c")
  );

  const currentTemperature = Math.round(getTemperature(data.current?.temp_c));
  const maxTemperature = Math.round(
    getTemperature(data.forecast?.forecastday[item.id].day.maxtemp_c)
  );
  const minTemperature = Math.round(
    getTemperature(data.forecast?.forecastday[item.id].day.mintemp_c)
  );

  // Left Text
  const currentText: LeftTextType = {
    topText: currentTemperature.toString() + "°",
    bottomText: `H:${maxTemperature}° L:${minTemperature}°`,
    image: "cloudy",
  };
  const otherText: LeftTextType = {
    topText: maxTemperature.toString() + "°",
    topTextGray: minTemperature + "°",
    bottomText: tempUnit.charAt(0).toUpperCase() + tempUnit.slice(1),
  };
  // Change shared value leftText on scroll
  updateLeftText(currentIndex, updateShared, currentText, otherText);

  // Graph Images
  const { timeArr, imageArr } = getGraphImageAndCoord(
    data,
    item.id,
    12,
    "condition.code"
  );
  const weatherImageArr = imageArr.map((code, index) =>
    useImage(
      weatherNameToImage(
        getWeatherName(parseInt(code)),
        data.forecast.forecastday[item.id].hour[timeArr[index]].is_day
      )
    )
  );

  // Get Temp Graph Data
  const tempDayArr = getDayArr(data, currentIndex, "temp_c");
  const tempForecastWithoutMidnight = tempDayArr.map((temp) => {
    return {
      mainLine: temp,
    };
  });
  const tempAvgForecast = useForecastData(tempForecastWithoutMidnight);
  const tempGraphData = formatGraphDataCopy(data, tempAvgForecast);

  // Get Chance of Rain Graph Data
  const chanceOfRainDayArr = getDayArr(data, currentIndex, "chance_of_rain");
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
    data,
    chanceOfRainAvgForecast
  );

  return (
    <>
      {/* Temperature graph */}
      <GraphContainer
        cityName={cityName}
        state={tempState}
        isActive={tempIsActive}
        scrollInfoBold={tempDragText}
        currentIndex={currentIndex}
        hackyWeatherImage
      >
        <Graph
          graphData={tempGraphData}
          cityName={cityName}
          state={tempState}
          isActive={tempIsActive}
          graphHeight={200}
          yAxisLabel="°"
          domainTop={weekTempHigh + 10}
          domainBottom={weekTempLow - 10}
          loadedIndex={item.id}
          chartImageArrays={[timeArr, weatherImageArr as SkImage[]]}
          firstLineColor={"lightblue"}
        />
      </GraphContainer>

      {/* Precipitation graph */}
      <GraphContainer
        cityName={cityName}
        state={rainState}
        isActive={rainIsActive}
        scrollInfoBold={chanceOfRainDragText}
        smallBold
        currentIndex={item.id}
        leftSide={
          <View className="h-12" style={{ justifyContent: "center" }}>
            <DefaultText className="text-2xl font-semibold ">
              Chance of Precipitation
            </DefaultText>
          </View>
        }
      >
        <Graph
          graphData={chanceOfRainGraphData}
          cityName={cityName}
          state={rainState}
          isActive={rainIsActive}
          graphHeight={200}
          yAxisLabel="%"
          loadedIndex={item.id}
          firstLineColor={"lightblue"}
        />
      </GraphContainer>
    </>
  );
};

export default React.memo(RenderConditionsGraphs);
