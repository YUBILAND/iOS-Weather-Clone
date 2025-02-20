import { View, Text, Animated, TextInput } from "react-native";
import React, { useCallback, useMemo } from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "./DefaultText";
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
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import OpacityCard from "./OpacityCard";
import { getCurrentTime, militaryHour } from "@/hooks/hooks";

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

  function getChordLength(sunriseTime: string, sunsetTime: string) {
    const hourDifference = Math.abs(
      militaryHour(sunsetTime) - militaryHour(sunriseTime)
    );
    const sunriseMinutePortion = parseInt(
      sunriseTime.split(":")[1].split(" ")[0]
    );
    const sunsetMinutePortion = parseInt(
      sunsetTime.split(":")[1].split(" ")[0]
    );
    const minuteDifference = Math.abs(
      sunsetMinutePortion - sunriseMinutePortion
    );

    let chordLength = hourDifference;
    if (sunsetMinutePortion > sunriseMinutePortion) {
      chordLength += minuteDifference / 60;
    } else {
      chordLength -= minuteDifference / 60;
    }
    return chordLength;
  }

  // Get the chord length between sunrise and sunset
  const chordLength = getChordLength(sunriseTime, sunsetTime);

  // Get Vertical Offset
  const yShift = getYShift(chordLength, xTicks);

  function getXOffset(sunriseTime: string, xTicks: number) {
    const sunriseTimeOnXAxis = regularTimeOnXAxis(sunriseTime);

    const firstIntersectionPreOffset =
      xTicks / 4 + (xTicks / 2 / Math.PI) * Math.asin(yShift / (xTicks / 2));

    const offset =
      firstIntersectionPreOffset - sunriseTimeOnXAxis * (xTicks / 24);
    return offset;
  }
  // Get Horizontal Offset
  const xOffset = getXOffset(sunriseTime, xTicks);

  const hourToWaveCoord = (x: number) => {
    //  get the sine wave coordinates for each hour x
    return (
      (xTicks / 2) *
      Math.sin((x - xTicks / 4 + xOffset) * (Math.PI / (xTicks / 2)))
    );
  };

  const currentTime = getCurrentTime(location?.tz_id);

  const circleX = regularTimeOnXAxis(currentTime);
  const circleY =
    hourToWaveCoord(regularTimeOnXAxis(currentTime) * 60) - yShift;

  const DATA = useMemo(
    () =>
      Array.from({ length: xTicks + 1 }, (_, i) => ({
        hour: i * (24 / xTicks),
        // sine wave
        sunPath: hourToWaveCoord(i) - yShift,
        // current position of sun
        sunPosition: i === circleX * 60 ? circleY : null,
        phaseLine: 0,
      })),
    [chordLength]
  );

  const firstIntersectionPostOffset =
    xTicks / 4 -
    xOffset +
    (xTicks / 2 / Math.PI) * Math.asin(yShift / (xTicks / 2));

  const secondIntersectionPostOffset =
    (3 * xTicks) / 4 -
    xOffset -
    (xTicks / 2 / Math.PI) * Math.asin(yShift / (xTicks / 2));

  //   console.log("sunrise Time is ", sunriseTime);
  //   console.log(
  //     "first intersection happens at ",
  //     firstIntersectionPostOffset / 60
  //   );

  //   console.log("sunset Time is ", sunsetTime);
  //   console.log(
  //     "second intersection happens at ",
  //     secondIntersectionPostOffset / 60
  //   );
  //   console.log(chordLength);

  //   console.log(regularTimeOnXAxis(currentTime));
  //   console.log(hourToWaveCoord(regularTimeOnXAxis(currentTime) * 60) - yShift);

  return (
    <>
      {/* Chart */}
      <View
        // style={{ height: graphHeight, borderRadius: 20, overflow: "hidden"  }}
        style={{
          height: graphHeight,
        }}
      >
        <CartesianChart
          data={DATA}
          xKey="hour"
          yKeys={["sunPath", "sunPosition", "phaseLine"]}
          axisOptions={{
            lineColor: addLines
              ? {
                  grid: { x: "transparent" as Color, y: "white" as Color },
                  frame: "white",
                }
              : "transparent",

            // font: font,
            labelColor: "transparent",
          }}
          frame={{
            lineColor: "transparent",
          }}
          // domainPadding={10}
          chartPressState={state}
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
                  {/* Sun Position */}
                  <Scatter
                    points={points.sunPosition}
                    shape="circle"
                    radius={strokeWidth + 2}
                    style="fill"
                    color="white"
                  />

                  {/* Phase Line */}
                  <Line
                    points={points.phaseLine}
                    color={colors.bgWhite(0.5)}
                    strokeWidth={strokeWidth - 3}
                    curveType="natural"
                  />

                  {addBackground && (
                    <>
                      <Area
                        points={points.phaseLine}
                        y0={chartBounds.top}
                        animate={{ type: "timing", duration: 300 }}
                        curveType="natural"
                      >
                        <LinearGradient
                          start={vec(chartBounds.bottom, 150)}
                          end={vec(chartBounds.bottom, chartBounds.bottom)}
                          colors={[
                            "rgba(124,197,227,0.6)",
                            "rgba(124,197,227,0.4)",
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
                            "rgba(41, 57, 63, 0.6)",
                          ]}
                        />
                      </Area>
                    </>
                  )}

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

const getYShift = (chordLength: number, xTicks: number) => {
  const yShift = (xTicks / 2) * Math.sin((Math.PI / 24) * (12 - chordLength));
  return yShift;
};

//  convert 60 tick time to 100 tick x axis
export function regularTimeOnXAxis(timeString: string) {
  const minutePortion = parseInt(timeString.split(":")[1].split(" ")[0]);
  const timeOnXAxis = militaryHour(timeString) + minutePortion / 60;
  return timeOnXAxis;
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  const width = 1;
  const rectX = useDerivedValue(() => x.value - width / 2); // offset to center line

  return (
    <>
      <Rect x={rectX} y={0} width={width} height={500} color="white" />

      <Circle cx={x} cy={y} r={10} color="black" />

      <Circle cx={x} cy={y} r={8} color="white" />
    </>
  );
}

export default SunPhaseGraph;
