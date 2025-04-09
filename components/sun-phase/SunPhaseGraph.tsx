import { colors } from "@/assets/colors/colors";
import { getChordLength, getCurrentTime } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import {
  BlurStyle,
  Canvas,
  Color,
  LinearGradient,
  Path,
  Skia,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import {
  Area,
  CartesianChart,
  ChartPressState,
  Line,
  Scatter,
} from "victory-native";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import {
  getFirstIntersectionPostOffset,
  getSecondIntersectionPostOffset,
} from "./utils/getIntersectionOffset";
import { getSunPathPercentage } from "./utils/getSunPathPercentage";
import { getXOffset } from "./utils/getXOffset";
import { getYShift } from "./utils/getYShift";
import { useSunPhaseData } from "./utils/useSunPhaseData";
import Animated from "react-native-reanimated";
import { useWeatherData } from "@/hooks/useWeatherData";
import getFont from "@/hooks/getFont";

const SunPhaseGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  removePress = false,
  strokeWidth,
  addBackground = false,
  addLines = false,
  domain = { top: 1200, bottom: -1200 },
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
  domain?: { top: number; bottom: number };
}) => {
  const font = getFont();

  const data = useWeatherData();
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
            tickValues: [0, 6, 12, 18, 24],
          }}
          frame={{
            lineColor: "transparent",
          }}
          domain={{ y: [domain.bottom, domain.top] }}
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

            const paint = Skia.Paint();
            // Set the paint color to white
            paint.setColor(Skia.Color("white"));
            const sigma = 2; // adjust for stronger or softer glow
            const maskFilter = Skia.MaskFilter.MakeBlur(
              data[cityName].current.is_day ? BlurStyle.Solid : BlurStyle.Outer,
              sigma,
              true
            );
            paint.setMaskFilter(maskFilter);

            // console.log(
            //   points.sunPosition.filter((arr, idx) => arr.yValue)[0].yValue
            // );

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
                    // shape={(props) => (
                    //   <SemiCircle x={props.x} y={props.y} radius={1000} />
                    // )}
                    radius={strokeWidth + 2}
                    style="fill"
                    // color="white"
                    // @ts-ignore doesn't recognize paint as prop but it works, add glow effect
                    paint={paint}
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

const SemiCircle = ({
  x,
  y,
  radius,
}: {
  x: number;
  y: number;
  radius: number;
}) => {
  // Create a Skia Path for a semicircle
  const skiaPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.moveTo(x - radius, y);
    path.rArcTo(radius * 2, radius * 2, 0, false, true, radius * 2, 0);
    path.close();
    return path;
  }, [x, y, radius]);

  return (
    <Canvas style={{ width: radius * 2, height: radius, position: "absolute" }}>
      <Path path={skiaPath} color="blue" />
    </Canvas>
  );
};

export default React.memo(SunPhaseGraph);
