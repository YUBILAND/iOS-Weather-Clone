import { View, Text, Animated, TextInput } from "react-native";
import React, { useCallback, useMemo } from "react";
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
  SharedValue,
  useDerivedValue,
  useSharedValue,
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
}) => {
  const font = useFont(SpaceMono, 12);

  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast, current, location } = data[cityName];

  const moonriseTime = forecast?.forecastday[0].astro.moonrise;
  const moonsetTime = forecast?.forecastday[0].astro.moonset;
  const currentMoonIllumination =
    forecast?.forecastday[0].astro.moon_illumination;

  // from -100 to 100
  const moonPhaseProgress = parseInt(currentMoonIllumination);

  const MoonPhaseData = Array(30)
    .fill(0)
    .map((num, index) => {
      const A = (100 - 2 * moonPhaseProgress) / 100; // amplitude
      const r = 10;
      const a = 0;
      const x = index - 15;

      return {
        day: x,
        moonPath: A * r * Math.cos(x / r) + a,
        // moonPathTop: -r * Math.acos(x / (A * r)) + a,
        // moonPathBottom

        sunPosition: 0,
        phaseLine: 0,
      };
    });

  const image = useImage(require("../../assets/images/moon.png"));

  const size = 200;

  const somePadding = 10;

  return (
    <>
      {/* Chart */}

      <View style={{ overflow: "hidden" }}>
        <View
          style={{
            height: graphHeight,
            width: "100%",
            transform: [{ rotate: "90deg" }],
            overflow: "hidden",
          }}
        >
          <CartesianChart
            data={MoonPhaseData}
            xKey="day"
            yKeys={["moonPath", "sunPosition", "phaseLine"]}
            // axisOptions={{
            //   lineColor: addLines
            //     ? {
            //         grid: { x: "white" as Color, y: "white" as Color },
            //         frame: "white",
            //       }
            //     : "transparent",
            // }}
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
                        x: canvasSize.width / 2 + 8 - size / 2,
                        y: canvasSize.height / 2 - 4 - size / 2,
                        width: size,
                        height: size,
                      }}
                    />
                    {/* Sun Path */}
                    <>
                      {/* Night time left side */}

                      <Line
                        points={points.moonPath}
                        color={colors.bgWhite(0.5)}
                        strokeWidth={strokeWidth}
                        curveType="natural"
                      />

                      <Area
                        points={points.moonPath}
                        y0={chartBounds.bottom}
                        color={colors.bgBlack(0.6)}
                        animate={{ type: "timing", duration: 300 }}
                      ></Area>

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
