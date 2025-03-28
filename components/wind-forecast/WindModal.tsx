import { GraphKeyType } from "@/constants/constants";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { getDayArr } from "../precipitation/utils/getDayArr";
import WindModalDescription from "./WindModalDescription";
import { getWeekMaxWind } from "./utils/getWeekMaxWind";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";

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

  const { state: windState, isActive: windIsActive } = useChartPressState({
    x: 0,
    y: {
      windSpeed: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
      secondLine: 0,
    },
  });

  const windScrollInfoBold = useAnimatedProps(() => {
    const speedAtIndex = windState.y.windSpeed.value.value;
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
        ? Math.round(hour[index].gust_mph)
        : Math.round(hour[23].gust_mph)
    } mph`;
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
  const currentWindSpeed = Math.round(current.wind_mph);

  // Get daily Max Wind Speed
  const dailyMaxWindSpeed = forecast.forecastday[id].day.maxwind_mph;

  // Get Daily Min Wind Speed
  const hourlyWindSpeedArr = getDayArr(data[cityName], id, "wind_mph");
  const dailyMinWindSpeed = Math.min(...hourlyWindSpeedArr);

  // Get Current Gust Speed
  const currentGustSpeed = current.gust_mph;

  // Get Max Gust
  const gustArr = getDayArr(data[cityName], id, "gust_mph");
  const dailyMaxGustSpeed = Math.max(...gustArr);

  // Get Week Max Wind for Graph Range
  const weekMaxWind = getWeekMaxWind(data[cityName]);

  const currentText: LeftTextType = {
    topText: currentWindSpeed.toString(),
    topTextSmall: "mph",
    topTextGray: currentWindDirection,
    bottomText: `Gusts: ${Math.round(currentGustSpeed)} mph`,
  };
  const otherText: LeftTextType = {
    topText:
      Math.round(dailyMinWindSpeed) + "–" + Math.round(dailyMaxWindSpeed),
    topTextSmall: "mph",
    bottomText: `Gusts up to ${Math.round(dailyMaxGustSpeed)} mph`,
  };

  updateLeftText(id, updateShared, currentText, otherText);

  return (
    <View className=" pt-[70] mt-[-70]">
      <GraphContainer
        cityName={cityName}
        state={windState}
        isActive={windIsActive}
        scrollInfoBold={[windScrollInfoBold, belowWindScroll]}
        currentIndex={currentIndex}
        leftSide={<></>}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={windState}
          isActive={windIsActive}
          yAxisLabel="mph"
          loadedIndex={id}
          apiObjectString={["wind_mph", "gust_mph"] as (keyof GraphKeyType)[]}
          domainTop={weekMaxWind + 10}
          customColor="bgBlue"
          customColor2="bgGreen"
          addWeatherText={{ unit: "" }}
        />
      </GraphContainer>

      <WindModalDescription data={data[cityName]} currentIndex={id} />
    </View>
  );
};

export default WindModal;
