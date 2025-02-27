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
import { getSunPathPercentage } from "./utils/getSunPathPercentage";
import { useSunPhaseData } from "./utils/useSunPhaseData";
import { getXOffset } from "./utils/getXOffset";
import { getYShift } from "./utils/getYShift";
import {
  getFirstIntersectionPostOffset,
  getSecondIntersectionPostOffset,
} from "./utils/getIntersectionOffset";
import ToolTip from "../graphs/victoryComponents/Tooltip";

const SunPhaseGraph = ({
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
      sunPath: number;
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

  const sunriseTime = forecast?.forecastday[0].astro.sunrise;
  const sunsetTime = forecast?.forecastday[0].astro.sunset;

  const xTicks = 1440; // 1440 ticks as that is how many minutes in a day

  // Get the chord length between sunrise and sunset
  const chordLength = getChordLength(sunriseTime, sunsetTime);

  // Get Vertical Offset
  const yShift = getYShift(chordLength, xTicks);

  // Get Horizontal Offset
  const xOffset = getXOffset(sunriseTime, xTicks, yShift);

  const currentTime = getCurrentTime(location?.tz_id);

  const sunPhaseData = useSunPhaseData(
    xTicks,
    chordLength,
    currentTime,
    yShift,
    xOffset
  );

  // Find X where intersection happens after offset has been applied.
  const firstIntersectionPostOffset = getFirstIntersectionPostOffset(
    xTicks,
    xOffset,
    yShift
  );

  const secondIntersectionPostOffset = getSecondIntersectionPostOffset(
    xTicks,
    xOffset,
    yShift
  );

  const sunPathPercentage = getSunPathPercentage(sunPhaseData);

  return (
    <>
      {/* Chart */}
      <View
        style={{
          height: graphHeight,
        }}
      >
        <CartesianChart
          data={sunPhaseData}
          xKey="hour"
          yKeys={["sunPath", "sunPosition", "phaseLine"]}
          axisOptions={{
            lineColor: addLines
              ? {
                  grid: { x: "white" as Color, y: "white" as Color },
                  frame: "white",
                }
              : "transparent",
          }}
          xAxis={{
            font: addLines ? font : null,
            labelColor: addLines ? colors.lightGray : "transparent",
            lineColor: addLines ? "white" : "transparent",
          }}
          frame={{
            lineColor: "transparent",
          }}
          domain={{ y: [-1400, 1400] }}
          chartPressState={state}
          padding={{ bottom: addLines ? 10 : 0 }}
        >
          {({ points, chartBounds }) => {
            const nightTime1 = points.sunPath.filter(
              (point) =>
                (point.xValue! as number) <=
                firstIntersectionPostOffset / (xTicks / 24)
            );
            const dayTime = points.sunPath.filter(
              (point) =>
                (point.xValue! as number) >=
                  firstIntersectionPostOffset / (xTicks / 24) &&
                (point.xValue! as number) <=
                  secondIntersectionPostOffset / (xTicks / 24)
            );
            const nightTime2 = points.sunPath.filter(
              (point) =>
                (point.xValue! as number) >=
                secondIntersectionPostOffset / (xTicks / 24)
            );

            return (
              <>
                <>
                  {addBackground && (
                    <>
                      <Area
                        points={points.phaseLine}
                        y0={chartBounds.top}
                        animate={{ type: "timing", duration: 300 }}
                        curveType="natural"
                      >
                        <LinearGradient
                          start={vec(chartBounds.top, 150)}
                          end={vec(chartBounds.top, chartBounds.top)}
                          colors={[
                            `rgba(124,197,227,${sunPathPercentage})`,
                            `rgba(124,197,227,${sunPathPercentage / 2})`,
                          ]}
                        />
                      </Area>

                      <Area
                        points={points.phaseLine}
                        y0={chartBounds.bottom}
                        animate={{ type: "timing", duration: 300 }}
                        curveType="natural"
                      >
                        <LinearGradient
                          start={vec(chartBounds.bottom, 150)}
                          end={vec(chartBounds.bottom, chartBounds.bottom)}
                          colors={[
                            "rgba(41, 57, 63, 0.6)",
                            "rgba(41, 57, 63, 0.1)",
                          ]}
                        />
                      </Area>
                    </>
                  )}

                  {/* Sun Path */}
                  <>
                    {/* Night time left side */}
                    <Line
                      points={nightTime1}
                      color={colors.bgBlack(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    />

                    {/* Day time */}
                    <Line
                      points={dayTime}
                      color={colors.bgWhite(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    />

                    {/* Night time right side */}
                    <Line
                      points={nightTime2}
                      color={colors.bgBlack(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    />
                  </>

                  {/* Phase Line */}
                  <Line
                    points={points.phaseLine}
                    color={colors.bgWhite(0.5)}
                    strokeWidth={strokeWidth - 3}
                    curveType="natural"
                  />

                  {/* Sun Position */}
                  <Scatter
                    points={points.sunPosition}
                    shape="circle"
                    radius={strokeWidth + 2}
                    style="fill"
                    color="white"
                  />
                </>
                {isActive && !removePress ? (
                  <ToolTip x={state.x.position} y={state.y.sunPath.position} />
                ) : null}
              </>
            );
          }}
        </CartesianChart>
      </View>
    </>
  );
};

export default SunPhaseGraph;
