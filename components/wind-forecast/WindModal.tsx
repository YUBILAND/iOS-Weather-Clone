import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useWeatherData } from "@/hooks/useWeatherData";
import { SkImage } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import { GraphDefaultY } from "../graphs/utils/constants";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import { getGraphImageAndCoord } from "../graphs/utils/getGraphImageAndCoord";
import { useForecastData } from "../graphs/utils/useForecastData";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import { convertWindUnits } from "./utils/convertWindUnits";
import { getOddWindDirectionImages } from "./utils/getOddWindDirectionImages";
import { getWeekMaxWind } from "./utils/getWeekMaxWind";

interface WindModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const WindModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: WindModalProps) => {
  const data = useWeatherData();
  const { current, forecast } = data[cityName];
  const windUnits = useOtherUnits()["wind"];

  const { state: windState, isActive: windIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });

  const windScrollInfoBold = useAnimatedProps(() => {
    const speedAtIndex = windState.y.mainLine.value.value;
    const hour = data[cityName].forecast.forecastday[currentIndex].hour;
    const index = windState.x.value.value;
    const windSpeed = `${Math.round(speedAtIndex)} ${
      index < 24 ? hour[index].wind_dir : hour[23].wind_dir
    }`;
    return {
      text: windSpeed,
      value: windSpeed,
    };
  });
  const belowWindScroll = useAnimatedProps(() => {
    const index = windState.x.value.value;
    const hour = data[cityName].forecast.forecastday[currentIndex].hour;
    const gustSpeed = `Gusts: ${
      index < 24
        ? Math.round(convertWindUnits(hour[index].gust_mph, windUnits))
        : Math.round(convertWindUnits(hour[23].gust_mph, windUnits))
    } ${windUnits}`;
    return {
      text: gustSpeed,
      value: gustSpeed,
    };
  });

  // Sync Wind IsActive to Modal.tsx's isActive to hide Animated View on drag
  useSyncAnimatedValue(windIsActive, isActiveShared);

  // Get Current Wind Direction
  const currentWindDirection = current.wind_dir;

  // Get current Wind Speed
  const currentWindSpeed = Math.round(
    convertWindUnits(current.wind_mph, windUnits)
  );

  // Get daily Max Wind Speed
  const dailyMaxWindSpeed = convertWindUnits(
    forecast.forecastday[id].day.maxwind_mph,
    windUnits
  );

  // Get Daily Min Wind Speed
  const { arrMin: dailyMinWindSpeed } = getMinMaxArr(
    getDayArr(data[cityName], id, "wind_mph")
  );

  // Get Current Gust Speed
  const currentGustSpeed = convertWindUnits(current.gust_mph, windUnits);

  // Get Max Gust
  const { arrMax: dailyMaxGustSpeed } = getMinMaxArr(
    getDayArr(data[cityName], id, "gust_mph")
  );

  // Get Week Max Wind for Graph Range
  const weekMaxWind = convertWindUnits(
    getWeekMaxWind(data[cityName]),
    windUnits
  );

  const currentText: LeftTextType = {
    topText: currentWindSpeed.toString(),
    topTextSmall: windUnits,
    topTextGray: currentWindDirection,
    bottomText: `Gusts: ${Math.round(currentGustSpeed)} ${windUnits}`,
  };
  const otherText: LeftTextType = {
    topText:
      Math.round(dailyMinWindSpeed) + "–" + Math.round(dailyMaxWindSpeed),
    topTextSmall: windUnits,
    bottomText: `Gusts up to ${Math.round(dailyMaxGustSpeed)} ${windUnits}`,
  };

  updateLeftText(id, updateShared, currentText, otherText);

  const { timeArr } = getGraphImageAndCoord(
    data[cityName],
    id,
    12,
    "condition.code"
  );

  const oddWindDirectionImages = getOddWindDirectionImages(data[cityName], id);

  const windDayArr = getDayArr(data[cityName], id, "wind_mph");
  const gustDayArr = getDayArr(data[cityName], id, "gust_mph");

  const windForecastWithoutMidnight = windDayArr.map((wind, index) => {
    return {
      mainLine: wind,
      secondLine: gustDayArr[index],
    };
  });
  const windAvgForecast = useForecastData(windForecastWithoutMidnight);
  const windGraphData = formatGraphDataCopy(data[cityName], windAvgForecast);

  return (
    <View className=" pt-[70] mt-[-70]">
      <GraphContainer
        cityName={cityName}
        state={windState}
        isActive={windIsActive}
        scrollInfoBold={[windScrollInfoBold, belowWindScroll]}
        currentIndex={currentIndex}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={windState}
          isActive={windIsActive}
          yAxisLabel={windUnits}
          loadedIndex={id}
          domainTop={windUnits === "bft" ? 12 : weekMaxWind + 10}
          // customColor="bgBlue"
          // customColor2="bgGreen"
          chartImageArrays={[timeArr, oddWindDirectionImages as SkImage[]]}
          graphData={windGraphData}
          firstLineColor={"lightblue"}
          secondLineColor={"gray"}
        />
      </GraphContainer>
    </View>
  );
};

export default WindModal;
