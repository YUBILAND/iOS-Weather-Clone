import { colors } from "@/assets/colors/colors";
import getFont from "@/hooks/getFont";
import { getChordLength, getCurrentTime } from "@/hooks/hooks";
import { useWeatherData } from "@/hooks/useWeatherData";
import {
  BlurStyle,
  Color,
  LinearGradient,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import {
  Area,
  CartesianChart,
  ChartPressState,
  Line,
  Scatter,
} from "victory-native";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import { getIntersectionPostOffset } from "./utils/getIntersectionOffset";
import { getSunGraphPoint } from "./utils/getSunGraphPoints";
import { getSunPathPercentage } from "./utils/getSunPathPercentage";
import { getXOffset } from "./utils/getXOffset";
import { getYShift } from "./utils/getYShift";
import { useSunPhaseData } from "./utils/useSunPhaseData";

type SunChartPressState = ChartPressState<{
  x: number;
  y: {
    sunPath: number;
    sunPosition: number;
    phaseLine: number;
  };
}>;

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
  state: SunChartPressState;
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

  const { forecast, location } = data[cityName];

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
  const { firstIntersectionPostOffset, secondIntersectionPostOffset } =
    getIntersectionPostOffset(xTicks, xOffset, yShift);

  const sunPathPercentage = getSunPathPercentage(sunPhaseData);

  const axisOptions = {
    lineColor: addLines
      ? {
          grid: { x: "white" as Color, y: "white" as Color },
          frame: "white",
        }
      : "transparent",
  };

  const xAxisOptions = {
    font: addLines ? font : null,
    labelColor: addLines ? colors.lightGray : "transparent",
    lineColor: addLines ? "white" : "transparent",
    tickValues: [0, 6, 12, 18, 24],
  };

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
          axisOptions={axisOptions}
          xAxis={xAxisOptions}
          // frame={{
          //   lineColor: "transparent",
          // }}
          domain={{ y: [domain.bottom, domain.top] }}
          chartPressState={state}
          padding={{ bottom: addLines ? 10 : 0 }}
        >
          {({ points, chartBounds }) => {
            const { nightTime1, dayTime, nightTime2 } = getSunGraphPoint(
              points,
              firstIntersectionPostOffset,
              secondIntersectionPostOffset,
              xTicks
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

            return (
              <>
                <>
                  {addBackground && (
                    <>
                      <Area
                        points={points.phaseLine}
                        y0={chartBounds.top}
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

export default React.memo(SunPhaseGraph);
