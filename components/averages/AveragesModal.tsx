import { getTemperature } from "@/hooks/useDisplayUnits";
import { useLayout } from "@/hooks/useLayout";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
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
import { GraphDefaultY } from "../graphs/utils/constants";
import { getDragXY } from "../helper-functions/helperFunctions";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import AveragesModalDescription from "./AveragesModalDescription";
import Slider from "./Slider";
import {
  averageRangeExample,
  SelectAverage,
  temperatureGradient,
  temperatureGradientLine,
} from "./utils/constants";
import { getAverageData } from "./utils/getAverageData";
import { getLineData } from "./utils/getLineData";
import { getPrecipGraphData } from "./utils/getPrecipGraphData";
import { getTempGraphData } from "./utils/getTempGraphData";

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
    const { mainLine } = getDragXY(tempState);
    const celsius = Math.round(mainLine) + degSymbol;
    return {
      text: celsius,
      value: celsius,
    };
  });
  const tempDragBottomText = useAnimatedProps(() => {
    const { secondLine, thirdLine } = getDragXY(tempState);
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

  const {
    blueLineArr,
    currentBlueLineAverage,
    currentGrayLineAverage,
    lastAverageRainDifference,
  } = getLineData();

  const rainDragWhiteText = useAnimatedProps(() => {
    const {
      xValue,
      mainLine: blueLine,
      secondLine: grayLine,
    } = getDragXY(rainState);

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
    const {
      xValue,
      mainLine: blueLine,
      secondLine: grayLine,
    } = getDragXY(rainState);

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

  const { layout, onLayout } = useLayout();

  const translateX = useSharedValue(0);
  const handleClickTemp = () => {
    runOnUI(() => (translateX.value = 0))();
    setSelectedAverage("temperature");
  };
  const handleClickPrecip = () => {
    runOnUI(() => (translateX.value = layout ? layout.width / 2 : 0))();
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
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: null },
  ]);
  const [precipLeftText, setPrecipLeftText] = useState<LeftTextType[]>([
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: null },
  ]);

  const tempLeftTextSharedRef = useRef(
    useSharedValue<LeftTextType[]>([
      {
        topText: "No Data",
        topTextGray: "",
        bottomText: "No Data",
        image: null,
      },
    ])
  );
  const precipLeftTextSharedRef = useRef(
    useSharedValue<LeftTextType[]>([
      {
        topText: "No Data",
        topTextGray: "",
        bottomText: "No Data",
        image: null,
      },
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

  const dayArr = data[cityName].forecast.forecastday[0].day;
  const todaysHigh = getTemperature(dayArr.maxtemp_c);

  const tempGraphData = getTempGraphData(data[cityName]);

  const precipGraphData = getPrecipGraphData(data[cityName]);

  const TempGraphContainerProps = {
    cityName,
    state: tempState,
    isActive: tempIsActive,
    scrollInfoBold: [tempDragWhiteText, tempDragBottomText],
    currentIndex: 0,
    whiteTextFontSize: 30,
    stopLeftXValue: 5,
  };

  const TempGraphProps = {
    cityName,
    // @ts-ignore, used Pick but now sure why it still requires all keys
    state: tempState,
    isActive: tempIsActive,
    yAxisLabel: "°",
    // Tweaked these values, they seem to fit but not sure why
    domainTop: rangeHigh + (tempUnit === "celsius" ? 10 : 18),
    domainBottom: rangeLow - (tempUnit === "celsius" ? 10 : 28),
    loadedIndex: 0,
    removeArea: true,
    removeShade: true,
    removeLine: true,
    innerLeftText: {
      top: "Today's High",
      bottom: Math.round(todaysHigh).toString() + "°",
    },
    graphData: tempGraphData,
    areaRange: temperatureGradient,
    firstLineColor: temperatureGradientLine,
    secondLineColor: "transparent",
    thirdLineColor: "transparent",
  };

  const TempGraphLegend = () => {
    return (
      <View className="pt-4 pl-2 ">
        <GraphLegend
          leftText="Today"
          rightText={`Normal Range (${Math.round(
            rangeLow
          )}${degSymbol} to ${Math.round(rangeHigh)}${degSymbol})`}
          firstColorsArr={temperatureGradient as [string, string, ...string[]]}
          secondColorsArr={temperatureGradient as [string, string, ...string[]]}
        />
      </View>
    );
  };

  const SliderProps = {
    onPress1: handleClickTemp,
    onPress2: handleClickPrecip,
    onLayout,
    animatedStyles,
  };

  const TempGraphLeftText = () => {
    return (
      <View className="pt-4">
        <View className="relative">
          <Animated.View className="absolute" style={isLeftTextVisible}>
            <GraphLeftText
              leftText={tempLeftText}
              selectedModal="averages"
              id={0}
            />
          </Animated.View>
        </View>
      </View>
    );
  };

  const PrecipGraphLeftText = () => {
    return (
      <View className="pt-4">
        <View className="relative">
          <Animated.View className="absolute" style={isLeftTextVisible}>
            <GraphLeftText
              leftText={precipLeftText}
              selectedModal="averages"
              id={0}
            />
          </Animated.View>
        </View>
      </View>
    );
  };

  const PrecipGraphContainerProps = {
    cityName,
    state: rainState,
    isActive: rainIsActive,
    scrollInfoBold: [rainDragWhiteText, rainDragBottomText],
    smallBold: true,
    currentIndex: 0,
    tickRange: 40,
    stopRightXValue: blueLineArr.length - 1,
    whiteTextFontSize: 30,
    last30DaysMode: true,
    stopLeftXValue: 7,
  };

  const PrecipGraphProps = {
    cityName,
    graphData: precipGraphData,
    // @ts-ignore, used Pick but now sure why it still requires all keys
    state: rainState,
    isActive: rainIsActive,
    yAxisLabel: "in",
    loadedIndex: 0,
    domainTop: 4,
    domainBottom: 0,
    innerLeftText: { bottom: currentGrayLineAverage + '"' },
    innerRightText: { bottom: currentBlueLineAverage + '"' },
    tickValues: Array(41)
      .fill(0)
      .map((_, index) => index),
    removeArea: true,
    removeShade: true,
    removeLine: true,
    firstLineColor: ["lightblue"],
    secondLineColor: "gray",
    secondLineDashed: true,
    last30DaysMode: true,
  };

  const PrecipGraphLegend = () => {
    return (
      <View className="pt-4 pl-2 ">
        <GraphLegend
          leftText="Last 30 days"
          rightText="Average"
          secondColorsArr={["gray", "gray"]}
        />
      </View>
    );
  };

  return (
    <>
      <View className="relative" onLayout={onLayout}>
        <Slider {...SliderProps} />
      </View>
      <View>
        {/* Temperature */}
        <View>
          <View style={{ opacity: selectedAverage === "temperature" ? 1 : 0 }}>
            <TempGraphLeftText />

            <GraphContainer {...TempGraphContainerProps}>
              <Graph {...TempGraphProps} />
            </GraphContainer>

            <TempGraphLegend />
          </View>

          {/* Precipitation */}
          <View
            style={{
              opacity: selectedAverage === "precipitation" ? 1 : 0,
              position: "absolute",
              width: "100%",
            }}
          >
            <PrecipGraphLeftText />

            <GraphContainer {...PrecipGraphContainerProps}>
              <Graph {...PrecipGraphProps} />
            </GraphContainer>

            <PrecipGraphLegend />
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
