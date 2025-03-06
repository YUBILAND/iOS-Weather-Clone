import { View, Text, Animated, TextInput, Pressable } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import {
  Area,
  CartesianChart,
  ChartPressState,
  Line,
  PointsArray,
  PolarChart,
  Scatter,
  useChartPressState,
} from "victory-native";
import {
  Circle,
  Color,
  Rect,
  useFont,
  Text as SkiaText,
  LinearGradient,
  vec,
  Skia,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import OpacityCard from "../atoms/OpacityCard";
import { getChordLength, getCurrentTime, militaryHour } from "@/hooks/hooks";
import Cursor from "../graphs/victoryComponents/Cursor";

import ToolTip from "../graphs/victoryComponents/Tooltip";
import MoonSVG from "./MoonSVG";
import { SvgXml } from "react-native-svg";

const MoonPhaseGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  removePress = false,
  strokeWidth,
  addBackground = false,
  addLines = false,
  offsetX,
  initialScrollPosition,
  userScrolledIndex,
}: {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      moonPath: number;
      sunPosition: number;
      phaseLine: number;
    };
  }>;
  isActive: boolean;
  graphHeight: number;
  removePress?: boolean;
  strokeWidth: number;
  addBackground?: boolean;
  addLines?: boolean;
  offsetX: SharedValue<number>;
  initialScrollPosition: number;
  userScrolledIndex: number;
}) => {
  const font = useFont(SpaceMono, 12);

  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast, current, location } = data[cityName];

  const moonriseTime = forecast?.forecastday[0].astro.moonrise;
  const moonsetTime = forecast?.forecastday[0].astro.moonset;
  const currentMoonIllumination =
    forecast?.forecastday[0].astro.moon_illumination;

  const startingMoonIllumination =
    (parseInt(currentMoonIllumination) / 100) * 15;

  function getMoonGraphIllumination(x: number) {
    const amplitude = 50;
    const xOffset = 3;
    const period = 4.6;
    const cutoff = 15;

    // Parabolic formula to calculate y

    // JS modulo can't handle negative, -1 % 15 should be 14 but gives -1
    const handleNegativeModulo =
      (((x + startingMoonIllumination) % cutoff) + cutoff) % cutoff;
    let y =
      amplitude * Math.cos(handleNegativeModulo / period + xOffset) + amplitude;

    // Apply bounds to ensure y stays between 0 and 100
    if (y > 100) y = 100;
    if (y < 0) y = 0;

    return y;
  }

  const MoonPhaseData = useMemo(
    () =>
      Array(30)
        .fill(0)
        .map((_, index) => {
          // const A = (100 - 2 * generateYValue(userScrolledIndex)) / 100; // amplitude

          // range is [-10, 10] for graph
          const A =
            -10 +
            (getMoonGraphIllumination(
              userScrolledIndex - initialScrollPosition / 120
            ) /
              100) *
              20; // amplitude

          const r = 8;
          const a = 0;
          const x = index - 15;

          return {
            day: x,
            // moonPath: A * r * Math.cos(x / r) + a,
            moonPath: -A * Math.pow(Math.cos((x * Math.PI) / (2 * r)), 1 / 2.2),

            // moonPathTop: -r * Math.acos(x / (A * r)) + a,
            // moonPathBottom

            sunPosition: 0,
            phaseLine: 0,
          };
        }),
    [userScrolledIndex]
  );

  const image = useImage(require("../../assets/images/moon.png"));

  const MOON_IMAGE_SIZE = 200;

  // Graph overflows a bit on the right so when rotated is offset to the right. Add some right padding to recenter it
  const GRAPH_PADDING_TO_RECENTER = 12;

  // Remove Animation when transitioning in reverse to prevent flicker

  const currentPhaseIndex = Math.abs(
    Math.floor(
      (userScrolledIndex -
        initialScrollPosition / 120 +
        startingMoonIllumination) /
        15
    ) % 2
  );

  const prevRef = useRef(currentPhaseIndex);
  const removeAnimationRef = useRef(false);
  // Store previous value to compare when chart area changes sides, then remove animation

  if (prevRef.current !== currentPhaseIndex) {
    removeAnimationRef.current = true;
  } else {
    removeAnimationRef.current = false;
  }
  prevRef.current = currentPhaseIndex;
  // console.log(currentPhaseIndex);

  const moonGraphIllumination = Math.round(
    getMoonGraphIllumination(userScrolledIndex - initialScrollPosition / 120)
  );

  const waxingIndex = 0;

  const moonRotation =
    90 +
    ((currentPhaseIndex === waxingIndex
      ? moonGraphIllumination
      : 100 - moonGraphIllumination) /
      100) *
      20;
  console.log(moonRotation);

  return (
    <>
      {/* Chart */}

      <View className="w-full h-20 items-center">
        <DefaultText className="font-bold text-4xl">
          {currentPhaseIndex === waxingIndex
            ? moonGraphIllumination + "%"
            : 100 - moonGraphIllumination + "%"}
        </DefaultText>
      </View>

      <View
        style={{ overflow: "hidden", paddingRight: GRAPH_PADDING_TO_RECENTER }}
      >
        <View
          style={{
            height: graphHeight,
            width: "100%",
            transform: [{ rotate: moonRotation + "deg" }],
            overflow: "hidden",
          }}
        >
          <CartesianChart
            data={MoonPhaseData}
            xKey="day"
            yKeys={["moonPath", "sunPosition", "phaseLine"]}
            xAxis={{
              font: addLines ? font : null,
              labelColor: addLines ? colors.lightGray : "transparent",
              lineColor: addLines ? "white" : "transparent",
            }}
            yAxis={[
              {
                font: addLines ? font : null,
                labelColor: addLines ? colors.lightGray : "transparent",
                lineColor: addLines ? "white" : "transparent",
              },
            ]}
            frame={{
              lineColor: "transparent",
            }}
            domain={{ y: [-12, 12] }}
            chartPressState={state}
            padding={{ bottom: addLines ? 10 : 0 }}
          >
            {({ points, chartBounds, canvasSize }) => {
              return (
                <>
                  <>
                    <SkiaImage
                      image={image}
                      rect={{
                        // x: 203 - size / 2,
                        // y: graphHeight / 2 - 0 - size / 2,
                        x: canvasSize.width / 2 + 8 - MOON_IMAGE_SIZE / 2,
                        y: canvasSize.height / 2 - 4 - MOON_IMAGE_SIZE / 2,
                        width: MOON_IMAGE_SIZE,
                        height: MOON_IMAGE_SIZE,
                      }}
                      // origin={{
                      //   x: canvasSize.width / 2 + 8,
                      //   y: canvasSize.height / 2 - 4,
                      // }}
                      // transform={[{ rotate: 10 }]}
                    />
                    {/* Sun Path */}
                    <>
                      {/* Night time left side */}

                      {/* <Line
                        points={points.moonPath}
                        color={colors.bgWhite(0.5)}
                        strokeWidth={strokeWidth}
                        curveType="natural"
                      /> */}

                      <Area
                        points={points.moonPath}
                        y0={
                          currentPhaseIndex === waxingIndex
                            ? chartBounds.bottom
                            : chartBounds.top
                        }
                        color={colors.bgBlack(0.6)}
                        animate={{
                          type: "timing",
                          duration: removeAnimationRef.current ? 0 : 300,
                        }}
                      />

                      {/* Day time */}
                      {/* <Line
                      points={dayTime}
                      color={colors.bgWhite(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    /> */}

                      {/* Night time right side */}
                      {/* <Line
                      points={nightTime2}
                      color={colors.bgBlack(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    /> */}
                    </>

                    {/* Phase Line */}
                    {/* <Line
                      points={points.phaseLine}
                      color={colors.bgWhite(0.5)}
                      strokeWidth={strokeWidth - 3}
                      curveType="natural"
                    /> */}

                    {/* Sun Position */}
                    {/* <Scatter
                    points={points.sunPosition}
                    shape="circle"
                    radius={strokeWidth + 2}
                    style="fill"
                    color="white"
                  /> */}
                  </>
                  {/* {isActive && !removePress ? (
                  <ToolTip x={state.x.position} y={state.y.moonPath.position} />
                ) : null} */}
                </>
              );
            }}
          </CartesianChart>
        </View>
      </View>
    </>
  );
};

export default MoonPhaseGraph;
