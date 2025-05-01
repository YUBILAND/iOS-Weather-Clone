import { getTemperature } from "@/hooks/useDisplayUnits";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphLegend from "../graphs/GraphLegend";
import { formatGraphDataCopy } from "../graphs/utils/formatGraphDataCopy";
import {
  getRainScrollValues,
  getTempScrollValues,
} from "../helper-functions/helperFunctions";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import { getWeekArr } from "../utils/getWeekArr";
import Slider from "./Slider";
import {
  averagePrecipExample,
  averageRangeExample,
  currentPrecipExample,
  temperatureGradient,
  temperatureGradientLine,
} from "./utils/constants";
import { getArrAverage } from "../air-pressure/AirPressureModal";
import { getCurrentHour } from "@/hooks/hooks";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import AveragesModalDescription from "./AveragesModalDescription";
import { useForecastData } from "../graphs/utils/useForecastData";
import { GraphDefaultY } from "../graphs/utils/constants";
import { WeatherData } from "@/constants/constants";

export const getAverageData = (data: WeatherData) => {
  const currentTimeZone = data.location.tz_id;
  const currentTimeIndex = getCurrentHour(currentTimeZone);
  const averageHigh = Math.round(
    getArrAverage(averageRangeExample.map((item) => getTemperature(item.high)))
  );
  const todaysTempArr = getDayArr(data, 0, "temp_c");
  const currentTemperature = todaysTempArr[currentTimeIndex];
  const tempFromAverage = Math.abs(
    Math.round(averageHigh - currentTemperature)
  );

  return { currentTemperature, averageHigh, tempFromAverage };
};

export type SelectAverage = "temperature" | "precipitation";

interface AveragesModalProps {
  cityName: string;
}
const AveragesModal = ({ cityName }: AveragesModalProps) => {
  const data = useWeatherData();
  const tempUnit = useTemperatureUnit();

  const [selectedAverage, setSelectedAverage] =
    useState<SelectAverage>("temperature");

  const degSymbol = "°";

  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });
  const tempDragWhiteText = useAnimatedProps(() => {
    const { mainLine } = getTempScrollValues(tempState);
    const celsius = Math.round(mainLine) + degSymbol;
    return {
      text: celsius,
      value: celsius,
    };
  });
  const tempDragBottomText = useAnimatedProps(() => {
    const { secondLine, thirdLine } = getTempScrollValues(tempState);
    const areaHigh = Math.round(secondLine);
    const areaLow = Math.round(thirdLine);

    const tempRange = `Normal range: ${areaLow}${degSymbol} to ${areaHigh}${degSymbol}`;
    return {
      text: tempRange,
      value: tempRange,
    };
  });

  const { currentTemperature, averageHigh, tempFromAverage } = getAverageData(
    data[cityName]
  );

  // Left Text
  const tempSign = currentTemperature >= averageHigh ? "+" : "-";
  const tempLeftTextObject: LeftTextType = {
    topText:
      tempSign +
      tempFromAverage +
      degSymbol +
      (tempSign === "+" ? " above " : " from ") +
      "average",
    bottomText: `Average high: ` + averageHigh + degSymbol,
  };

  const rainUnit = '"';

  const { state: rainState, isActive: rainIsActive } = useChartPressState({
    x: 0,
    y: GraphDefaultY,
  });

  const blueLineArr = currentPrecipExample;
  const grayLineArr = averagePrecipExample;
  const currentBlueLineAverage = blueLineArr[blueLineArr.length - 1].average;
  const currentGrayLineAverage = grayLineArr[blueLineArr.length - 1].average;
  const rainSign = currentBlueLineAverage >= currentGrayLineAverage ? "+" : "-";
  const precipLineDiff = Math.abs(
    currentBlueLineAverage - currentGrayLineAverage
  ).toFixed(2);
  const lastAverageRainDifference =
    rainSign + precipLineDiff.toString() + rainUnit;

  const rainDragWhiteText = useAnimatedProps(() => {
    const { xValue, blueLine, grayLine } = getRainScrollValues(rainState);

    const draggedSign = blueLine >= grayLine ? "+" : "-";
    const draggedLineDiff = Math.abs(blueLine - grayLine).toFixed(2);

    const averageRainDifference =
      draggedSign + draggedLineDiff.toString() + rainUnit;

    const isDraggingPastToday = xValue > blueLineArr.length - 1;
    return {
      text: isDraggingPastToday
        ? lastAverageRainDifference
        : averageRainDifference,
      value: averageRainDifference,
    };
  });
  const rainDragBottomText = useAnimatedProps(() => {
    const { xValue, blueLine, grayLine } = getRainScrollValues(rainState);

    const grayLineAverage =
      xValue > blueLineArr.length - 1 ? currentGrayLineAverage : grayLine;

    const positive = blueLine >= grayLine;

    const rainAverage =
      (positive ? "above" : "from") +
      " " +
      grayLineAverage +
      rainUnit +
      " " +
      "average";
    return {
      text: rainAverage,
      value: rainAverage,
    };
  });

  const { arrMax: rangeHigh } = getMinMaxArr(
    averageRangeExample.map((item) => getTemperature(item.high))
  );
  const { arrMin: rangeLow } = getMinMaxArr(
    averageRangeExample.map((item) => getTemperature(item.low))
  );

  const precipLeftTextObject: LeftTextType = {
    topText: lastAverageRainDifference + " from average",
    bottomText: `30-day average:` + " " + currentGrayLineAverage + rainUnit,
  };

  const onLayout = (event: {
    nativeEvent: { layout: { width: any; height: any } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const translateX = useSharedValue(0);
  const handleClickTemp = () => {
    translateX.value = 0;
    setSelectedAverage("temperature");
  };
  const handleClickPrecip = () => {
    translateX.value = layout.width / 2;
    setSelectedAverage("precipitation");
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value, {
          duration: 300,
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }));

  const updateTempLeftTextShared = useCallback(
    (newText: LeftTextType, id: number) => {
      runOnUI(() => {
        // Apparently creating a const results in stale comparison so have to
        // modify ref directly to get new reference so setState rerenders
        tempLeftTextSharedRef.current.value =
          tempLeftTextSharedRef.current.value.map((item, index) =>
            index === id ? newText : item
          );
        runOnJS(setTempLeftText)(tempLeftTextSharedRef.current.value);
      })();
    },
    []
  );
  const updatePrecipLeftTextShared = useCallback(
    (newText: LeftTextType, id: number) => {
      runOnUI(() => {
        // Apparently creating a const results in stale comparison so have to
        // modify ref directly to get new reference so setState rerenders
        precipLeftTextSharedRef.current.value =
          precipLeftTextSharedRef.current.value.map((item, index) =>
            index === id ? newText : item
          );
        runOnJS(setPrecipLeftText)(precipLeftTextSharedRef.current.value);
      })();
    },
    []
  );

  const [tempLeftText, setTempLeftText] = useState<LeftTextType[]>([
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
  ]);
  const [precipLeftText, setPrecipLeftText] = useState<LeftTextType[]>([
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
  ]);

  const tempLeftTextSharedRef = useRef(
    useSharedValue<LeftTextType[]>([
      { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
    ])
  );
  const precipLeftTextSharedRef = useRef(
    useSharedValue<LeftTextType[]>([
      { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
    ])
  );

  const isLeftTextVisible = useAnimatedStyle(() => {
    return {
      opacity: tempIsActive || rainIsActive ? 0 : 1,
    };
  });

  updateLeftText(
    0,
    updateTempLeftTextShared,
    tempLeftTextObject,
    tempLeftTextObject
  );
  updateLeftText(
    0,
    updatePrecipLeftTextShared,
    precipLeftTextObject,
    precipLeftTextObject
  );

  const todaysHigh = getTemperature(
    data[cityName].forecast.forecastday[0].day.maxtemp_c
  );

  const getTempGraphData = () => {
    const tempDayArr = getDayArr(data[cityName], 0, "temp_c");
    const tempForecastWithoutMidnight = averageRangeExample.map(
      (hour, index) => {
        return {
          mainLine: tempDayArr[index],
          secondLine: getTemperature(hour.high),
          thirdLine: getTemperature(hour.low),
        };
      }
    );
    const tempAvgForecast = useForecastData(tempForecastWithoutMidnight);
    const tempGraphData = formatGraphDataCopy(data[cityName], tempAvgForecast);

    return tempGraphData;
  };
  const tempGraphData = getTempGraphData();

  const getPrecipGraphData = () => {
    const totalPrecipDays = 40;
    const indexToShowDot = currentPrecipExample.length - 1;

    const precipDayArr = Array(totalPrecipDays)
      .fill(0)
      .map((_, index) => {
        return {
          // mainLine: hour.high,
          mainLine: currentPrecipExample[index]?.average ?? undefined,
          secondLine: averagePrecipExample[index]?.average ?? undefined,
        };
      });
    const precipGraphData = formatGraphDataCopy(
      data[cityName],
      precipDayArr,
      indexToShowDot
    );
    return precipGraphData;
  };
  const precipGraphData = getPrecipGraphData();

  return (
    <>
      <View className="relative" onLayout={onLayout}>
        <Slider
          onPress1={handleClickTemp}
          onPress2={handleClickPrecip}
          onLayout={onLayout}
          animatedStyles={animatedStyles}
        />
      </View>
      <View>
        {/* Temperature */}
        <View>
          <View style={{ opacity: selectedAverage === "temperature" ? 1 : 0 }}>
            <View className="pt-4">
              <View className="relative">
                <Animated.View className="absolute" style={isLeftTextVisible}>
                  <GraphLeftText
                    leftText={tempLeftText}
                    selectedModal="averages"
                    id={0}
                    leftTextShared={tempLeftTextSharedRef}
                  />
                </Animated.View>
              </View>
            </View>

            <GraphContainer
              cityName={cityName}
              state={tempState}
              isActive={tempIsActive}
              scrollInfoBold={[tempDragWhiteText, tempDragBottomText]}
              currentIndex={0}
              whiteTextFontSize={30}
              stopLeftXValue={5}
            >
              <Graph
                cityName={cityName}
                // @ts-ignore, used Pick but now sure why it still requires all keys
                state={tempState}
                isActive={tempIsActive}
                yAxisLabel="°"
                // Tweaked these values, they seem to fit but not sure why
                domainTop={rangeHigh + (tempUnit === "celsius" ? 10 : 18)}
                domainBottom={rangeLow - (tempUnit === "celsius" ? 10 : 28)}
                loadedIndex={0}
                removeArea
                removeShade
                removeLine
                innerLeftText={{
                  top: "Today's High",
                  bottom: Math.round(todaysHigh).toString() + "°",
                }}
                graphData={tempGraphData}
                areaRange={temperatureGradient}
                firstLineColor={temperatureGradientLine}
                secondLineColor={"transparent"}
                thirdLineColor={"transparent"}
              />
            </GraphContainer>

            <View className="pt-4 pl-2 ">
              <GraphLegend
                leftText="Today"
                rightText={`Normal Range (${Math.round(
                  rangeLow
                )}${degSymbol} to ${Math.round(rangeHigh)}${degSymbol})`}
                firstColorsArr={
                  temperatureGradient as [string, string, ...string[]]
                }
                secondColorsArr={
                  temperatureGradient as [string, string, ...string[]]
                }
              />
            </View>
          </View>

          {/* Precipitation */}
          <View
            style={{
              opacity: selectedAverage === "precipitation" ? 1 : 0,
              position: "absolute",
              width: "100%",
            }}
          >
            <View className="pt-4">
              <View className="relative">
                <Animated.View className="absolute" style={isLeftTextVisible}>
                  <GraphLeftText
                    leftText={precipLeftText}
                    selectedModal="averages"
                    id={0}
                    leftTextShared={precipLeftTextSharedRef}
                  />
                </Animated.View>
              </View>
            </View>

            <GraphContainer
              cityName={cityName}
              state={rainState}
              isActive={rainIsActive}
              scrollInfoBold={[rainDragWhiteText, rainDragBottomText]}
              smallBold
              currentIndex={0}
              tickRange={40}
              stopRightXValue={blueLineArr.length - 1}
              whiteTextFontSize={30}
              last30DaysMode
              stopLeftXValue={7}
            >
              <Graph
                cityName={cityName}
                graphData={precipGraphData}
                // @ts-ignore, used Pick but now sure why it still requires all keys
                state={rainState}
                isActive={rainIsActive}
                yAxisLabel="in"
                loadedIndex={0}
                domainTop={4}
                domainBottom={0}
                innerLeftText={{ bottom: currentGrayLineAverage + '"' }}
                innerRightText={{ bottom: currentBlueLineAverage + '"' }}
                tickValues={Array(41)
                  .fill(0)
                  .map((_, index) => index)}
                removeArea
                removeShade
                removeLine
                firstLineColor={["lightblue"]}
                secondLineColor={"gray"}
                secondLineDashed
                last30DaysMode
              />
            </GraphContainer>

            <View className="pt-4 pl-2 ">
              <GraphLegend
                leftText="Last 30 days"
                rightText="Average"
                secondColorsArr={["gray", "gray"]}
              />
            </View>
          </View>
        </View>
      </View>

      <AveragesModalDescription
        data={data[cityName]}
        selectedAverage={selectedAverage}
      />
    </>
  );
};

export default AveragesModal;
